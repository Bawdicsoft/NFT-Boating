import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useImmer } from "use-immer"
import QRCode from "react-qr-code"
import logo from "./../../Assets/logo.png"
import { collection, addDoc } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { useWeb3React } from "@web3-react/core"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { db, storage } from "../../DB/firebase-config"
import { useContextAPI } from "../../ContextAPI"
import html2canvas from "html2canvas"
import GoogleMapReact from "google-map-react"
import { Carousel } from "flowbite-react"
import WalletSide from "../../Comp/Header/WalletSide"

async function uploadImg({ uid, name, fileName, file }) {
  return new Promise((resolve, reject) => {
    console.log("Uploading image ...")

    const storageRef = ref(storage, `user-uploads/${uid}/images/${name}/${fileName}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        console.log("Upload is " + progress + "% done")
      },
      (error) => {
        console.error(error)
        reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((imgURL) => {
          console.log(`uploaded image:`, imgURL)
          resolve(imgURL)
        })
      }
    )
  })
}

export default function ListBoat() {
  const navigate = useNavigate()

  const { updateDocRequests, UserData } = useContextAPI()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const [state, setState] = useImmer({
    btnLoading: false,
    progresspercent: 0,
    popup: false,
    featuredImageData: null,
    galleryData: [],
    markerLoading: true,
    markerMap: {
      lat: 25.761681,
      lng: -80.191788,
      address: null,
      status: "null",
    },
  })

  const { account } = useWeb3React()
  const [open, setOpen] = useState(false)

  const location = watch(["location"])
  useMemo(() => {
    const runMap = async () => {
      if (state.markerMap.address !== location[0] && location[0] !== "") {
        try {
          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${location[0]}&key=${process.env.REACT_APP_MAPKEY}`
          )

          if (res.data.status === "OK") {
            setState((e) => {
              e.markerMap.lat = res.data.results[0].geometry.location.lat
              e.markerMap.lng = res.data.results[0].geometry.location.lng
              e.markerMap.address = location[0]
              e.markerMap.status = res.data.status
            })
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
    runMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  const featuredImage = watch(["featuredImage"])
  useMemo(() => {
    if (featuredImage[0] !== undefined) {
      if (featuredImage[0].length > 0) {
        const reader = new FileReader()
        reader.addEventListener("load", () => {
          setState((e) => {
            e.featuredImageData = reader.result
          })
        })
        reader.readAsDataURL(featuredImage[0][0])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featuredImage])

  const [images, setImages] = useState([])
  const handelGallery = (e) => {
    if (e.target.files.length === 0) return

    if (images.length > 0) {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]
        if (images.find((e) => e.name === file.name) === undefined) {
          const reader = new FileReader()
          reader.addEventListener("load", () => {
            setState((e) => {
              e.galleryData.push(reader.result)
            })
          })
          reader.readAsDataURL(file)

          setImages((e) => [...e, file])
        }
      }
    } else {
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]

        const reader = new FileReader()
        reader.addEventListener("load", () => {
          setState((e) => {
            e.galleryData.push(reader.result)
          })
        })
        reader.readAsDataURL(file)

        setImages((e) => [...e, file])
      }
    }
  }

  const onSubmit = async (e) => {
    if (state.markerMap.status === "OK") {
      setState((draft) => {
        draft.btnLoading = true
      })

      try {
        html2canvas(document.getElementById("HTML-IMG"), {
          allowTaint: true,
          useCORS: true,
        }).then(async (canvas) => {
          const API_KEY = process.env.REACT_APP_API_KEY
          const API_SECRET = process.env.REACT_APP_API_SECRET
          const URLforpinJSONtoIPFS = process.env.REACT_APP_URL_FOR_PIN_JSON_TO_IPFS

          axios
            .post(
              URLforpinJSONtoIPFS,
              {
                name: e.name,
                description: e.description,
                image: canvas.toDataURL(),
              },
              {
                headers: {
                  pinata_api_key: API_KEY,
                  pinata_secret_api_key: API_SECRET,
                },
              }
            )
            .then(async (response) => {
              const file = e.featuredImage[0]
              const name = e.name
              const fileName = file.name
              const featuredImageURL = await uploadImg({
                uid: UserData.uid,
                name,
                fileName,
                file,
              })

              let gallery = []
              for (let i = 0; i < images.length; i++) {
                const file = images[i]
                const name = e.name
                const fileName = file.name
                const imagesURL = await uploadImg({
                  uid: UserData.uid,
                  name,
                  fileName,
                  file,
                })
                gallery.push(imagesURL)
              }

              const request = {
                name: e.name,
                phone: e.phone,
                account: account,
                year: e.year,
                length: e.length,
                make: e.make,
                model: e.model,
                capacity: e.capacity,
                boatType: e.boatType,
                sleeps: e.sleeps,
                staterooms: e.staterooms,
                bedCount: e.bedCount,
                amenities: e.amenities,
                description: e.description,
                location: e.location,
                featuredImage: featuredImageURL,
                gallery: gallery,
                IpfsHash: response.data.IpfsHash,
                amount: e.amount,
              }

              try {
                await addDoc(collection(db, "Request"), {
                  request,
                })
              } catch (error) {
                console.error(error)
              }

              try {
                await updateDocRequests("users", {
                  request,
                  host: true,
                })
              } catch (error) {
                console.error(error)
              }

              const Mail = {
                fromName: "NFT Boating",
                from: `${process.env.REACT_APP_EMAIL}`,
                to: `${process.env.REACT_APP_EMAIL}, ${UserData.email}`,
                subject: "You have new request from NFT Boation",
                text: `
                name: ${e.name} \n
                phone: ${e.phone} \n
                email: ${UserData.email} \n
                account: ${account} \n
                year: ${e.year} \n
                length: ${e.length} \n
                make: ${e.make} \n
                model: ${e.model} \n
                capacity: ${e.capacity} \n
                boatType: ${e.boatType} \n
                sleeps: ${e.sleeps} \n
                staterooms: ${e.staterooms} \n
                bedCount: ${e.bedCount} \n
                amenities: ${e.amenities} \n
                description: ${e.description} \n
                location: ${e.location} \n
                amount: ${e.amount}
              `,
                html: `<!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8" />
                    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>EMAIL</title>
                  </head>
                  <body>
                    <div
                      style="
                        text-align: left;
                        width: 100%;
                        max-width: 500px;
                        padding: 20px;
                        background-color: #f6f6f6;
                        margin: auto;
                      "
                    >
                      <h1 style="text-align: center">NFT Boating</h1>
                      <table style="width: 100%">
                        <tr>
                          <th>Name</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.name}</td>
                        </tr>
                        <tr>
                          <th>Phone</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.phone}</td>
                        </tr>
                        <tr>
                          <th>Email</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${UserData.email}</td>
                        </tr>
                        <tr>
                          <th>account</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${account}</td>
                        </tr>
                        <tr>
                          <th>About User</th>
                        </tr>
                        <tr>
                          <th>year</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.year}</td>
                        </tr>
                        <tr>
                          <th>length</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.length}</td>
                        </tr>
                        <tr>
                          <th>make</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.make}</td>
                        </tr>
                        <tr>
                          <th>model</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.model}</td>
                        </tr>
                        <tr>
                          <th>capacity</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.capacity}</td>
                        </tr>
                        <tr>
                          <th>boatType</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.boatType}</td>
                        </tr>
                        <tr>
                          <th>sleeps</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.sleeps}</td>
                        </tr>
                        <tr>
                          <th>staterooms</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.staterooms}</td>
                        </tr>
                        <tr>
                          <th>bedCount</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.bedCount}</td>
                        </tr>
                        <tr>
                          <th>amenities</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.amenities}</td>
                        </tr>
                        <tr>
                          <th>description</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.description}</td>
                        </tr>
                        <tr>
                          <th>amount</th>
                        </tr>
                        <tr style="background-color: #eaeaea">
                          <td>${e.amount}</td>
                        </tr>
                      </table>
                      <br />
                      <p style="text-align: center">
                        <a href="https://">CopyRight: NFT Boating</a>
                      </p>
                    </div>
                  </body>
                </html>
                `,
              }

              const res = await axios.post(`${process.env.REACT_APP_EMAIL_END_URL}`, Mail)
              console.log(res.data)

              navigate(`/create-new`)
            })
            .catch((error) => {
              console.error(error)
              setState((e) => {
                e.btnLoading = false
              })
            })
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      console.error("Please Check Your address")
    }
  }

  if (UserData?.request !== undefined) {
    return (
      <div className="CreateNew min-h-full">
        <header className="bg-white">
          <div className="mt-20 mb-20 text-center">
            <h1 className="mb-6 font-bold text-3xl">
              You already request for a boat listing please check user nav and click create new
            </h1>
            <Link
              className="text-center w-[300px] m-auto  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 bg-indigo-600  hover:bg-indigo-700 cursor-pointer"
              to="/create-new"
            >
              create new
            </Link>
          </div>
        </header>
      </div>
    )
  }

  return (
    <div className="CreateNew min-h-full">
      <header className="bg-white">
        <div className="mt-20 mb-20 px-3 text-center">
          <h1 className="mb-1 font-bold text-5xl "> Become a Host </h1>
          <div className="max-w-3xl mx-auto text-center">
            NFT Boating is about to be a booming trend in luxury boat rental, and it's a great way
            to profit from your investment. With NFT Boating, you can list your boat with us and get
            connected with plenty of customers who are ready to rent.
          </div>
          <div className="max-w-3xl mx-auto text-center">
            This isn't a regular rent for the day; if you post your boat with us, it will be issued
            365 NFT memberships specifically for your boat. You'll choose the price for the day's
            rent, but keep in mind that the NFT will be valid for 5 years. The owner of the NFT can
            book a day for 5 consecutive years. In addition, the NFT owner will pay you a boat
            maintenance fee per year depending on the length of the boat.
          </div>
          <div className="max-w-3xl mx-auto text-center">
            So, if you're looking for a way to make some passive income from your luxury boat, NFT
            Boating is the perfect solution. Sign up to start earning today!
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl py-6 px-3 sm:px-6 lg:px-8">
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div>
                <h2 className="text-1xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                  Boat Specifications
                </h2>
                <p className="mt-4 text-gray-500">
                  Provide details about your vessel to help guests get a good idea of your rental.
                  We encourage you to post pictures—it increases the chances of prospective clients!
                </p>
                {/* <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-7 lg:gap-x-8">
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">
                      Considerations
                    </dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      Make sure to share high-resolution images so customers can
                      choose easily.
                    </dd>
                  </div>
                </dl> */}
                <div className="mt-18">
                  <iframe
                    width="400"
                    height="250"
                    src="https://www.youtube.com/embed/1hZc75B7sA8"
                    title="NFT boating tutorial | how to list your boat."
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  >
                    NFT boating tutorial{" "}
                  </iframe>
                  {/* <video
                    width={500}
                    src="<iframe width="752" height="409" src="https://www.youtube.com/embed/1hZc75B7sA8" title="NFT boating tutorial | how to list your boat." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>"
                    controls
                  ></video> */}
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="shadow sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-6">
                          <p>Personal Info</p>
                          <hr className="mt-3" />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Phone Number
                          </label>
                          <input
                            type="text"
                            id="phone"
                            placeholder="Phone Number"
                            {...register("phone", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="account"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Owner Wallet Address
                          </label>
                          <p
                            id="account"
                            className="w-full py-2.5 px-3 border cursor-pointer mb-4 rounded-md"
                          >
                            {account ? (
                              account
                            ) : (
                              <>
                                <span
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => setOpen(true)}
                                >
                                  Connect MetaMask
                                </span>
                                <WalletSide open={open} setOpen={setOpen} />
                              </>
                            )}
                          </p>
                        </div>

                        {/* <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="tellUs"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Tell us about your self.
                          </label>
                          <textarea
                            placeholder="Tell us about your self."
                            id="tellUs"
                            {...register("tellUs", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-2 rounded-md h-28"
                          />
                        </div> */}

                        <div className="col-span-6  mt-10">
                          <p>Boat Specifications</p>
                          <hr className="mt-3" />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Boat Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            {...register("name", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="year"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Year
                          </label>
                          <input
                            type="text"
                            id="year"
                            placeholder="Year"
                            {...register("year", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="length"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Length
                          </label>
                          <input
                            type="text"
                            id="length"
                            placeholder="Length"
                            {...register("length", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="make"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Make
                          </label>
                          <input
                            type="text"
                            id="make"
                            placeholder="Make"
                            {...register("make", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="model"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Model
                          </label>
                          <input
                            type="text"
                            id="model"
                            placeholder="Model"
                            {...register("model", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="capacity"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Capacity
                          </label>
                          <input
                            type="text"
                            id="capacity"
                            placeholder="Capacity"
                            {...register("capacity", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="boatType"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Boat type
                          </label>
                          <input
                            type="text"
                            id="boatType"
                            placeholder="Boat type"
                            {...register("boatType", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="sleeps"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Sleeps
                          </label>
                          <input
                            type="text"
                            id="sleeps"
                            placeholder="Sleeps"
                            {...register("sleeps", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="staterooms"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Staterooms
                          </label>
                          <input
                            type="text"
                            id="staterooms"
                            placeholder="Staterooms"
                            {...register("staterooms", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="bedCount"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Bed count
                          </label>
                          <input
                            type="text"
                            id="bedCount"
                            placeholder="Bed count"
                            {...register("bedCount", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div>

                        <div className="col-span-6 mt-10">
                          <p>Boat Amenities / Description</p>
                          <hr className="mt-3" />
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="amenities"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Amenities
                          </label>
                          <textarea
                            placeholder="Bathroom, Shower, GPS, etc"
                            id="amenities"
                            {...register("amenities", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-2 rounded-md h-28"
                          />
                          <p className="mb-4">please add amenities with a comma (,)</p>
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Description
                          </label>
                          <textarea
                            placeholder="Description"
                            id="description"
                            {...register("description", {
                              required: true,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md h-60"
                          />
                        </div>

                        <div className="col-span-6 mt-10">
                          <p>Boat Location</p>
                          <hr className="mt-3" />
                        </div>

                        <div className="col-span-6 ">
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Location
                          </label>
                          <div className="p-4 border-2 border-gray-300 border-dashed rounded-md">
                            <input
                              type="text"
                              id="location"
                              placeholder="Location"
                              {...register("location", {
                                required: true,
                              })}
                              className="w-full py-2.5 px-3 border rounded-md mb-4"
                            />
                            <div className="col-6" style={{ height: "350px" }}>
                              <GoogleMapReact
                                bootstrapURLKeys={{
                                  key: `${process.env.REACT_APP_MAPKEY}`,
                                }}
                                center={{
                                  lat: state.markerMap.lat,
                                  lng: state.markerMap.lng,
                                }}
                                defaultZoom={10}
                              >
                                <Marker
                                  lat={state.markerMap.lat}
                                  lng={state.markerMap.lng}
                                  address={state.markerMap.address}
                                />
                              </GoogleMapReact>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6  mt-10">
                          <p>Boat Images</p>
                          <hr className="mt-3" />
                        </div>

                        <div className="col-span-6 sm:col-span-6 mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Featured Image
                          </label>
                          <div className="mt-1 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className=" flex justify-center ">
                              <div className="space-y-1 text-center">
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="featuredImage"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      type="file"
                                      className="sr-only"
                                      id="featuredImage"
                                      {...register("featuredImage", {
                                        required: true,
                                      })}
                                    />
                                  </label>
                                  <p className="pl-1">Size should be 1x1</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            </div>
                            <div className="flex  justify-center">
                              {state.featuredImageData && (
                                <div id="HTML-IMG" className="mt-4 relative h-[300px] w-[300px]">
                                  <img
                                    src={state.featuredImageData}
                                    alt=""
                                    className="h-[300px] w-[300px] object-cover rounded-lg"
                                  />
                                  <div className="absolute bottom-1 w-full justify-center flex ">
                                    <img src={logo} className="w-[180px]" alt="" />
                                    <div className="px-1 py-1 bg-white">
                                      <QRCode value={"https://nftboating.io/"} size={70} />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6 sm:col-span-6 mb-3">
                          <label className="block text-sm font-medium text-gray-700">Gallery</label>
                          <div className="mt-1 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className=" flex justify-center ">
                              <div className="space-y-1 text-center">
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="gallery"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                  >
                                    <span>Upload files</span>
                                    <input
                                      type="file"
                                      className="sr-only"
                                      id="gallery"
                                      multiple
                                      onChange={handelGallery}
                                      required
                                    />
                                  </label>
                                  <p className="pl-1">Size should be 16x9</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            </div>
                            {state.galleryData.length > 0 && (
                              <div className="h-56 mt-4 bg-slate-500 sm:h-64 xl:h-80 2xl:h-96 rounded-lg">
                                <Carousel>
                                  {state.galleryData.map((img, index) => (
                                    <img key={index} src={img} alt="..." />
                                  ))}
                                </Carousel>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-6  mt-10">
                          <p>Pricing</p>
                          <hr className="mt-3" />
                        </div>

                        <div className="col-span-6 sm:col-span-3 mb-4">
                          <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            MemberShip Amount (USDT)
                          </label>
                          <input
                            type="number"
                            id="amount"
                            placeholder="MemberShip Amount (USDT)"
                            onWheel={(e) => e.target.blur()}
                            {...register("amount", {
                              required: true,
                              minLength: 1,
                            })}
                            className="w-full py-2.5 px-3 border  rounded-md"
                          />
                        </div>

                        <div className="col-span-6 sm:col-span-6">
                          <button
                            type="submit"
                            className={
                              `cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ` +
                              (state.btnLoading && "cursor-not-allowed")
                            }
                            disabled={state.btnLoading}
                          >
                            {state.btnLoading && (
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            )}
                            Request Submit{state.btnLoading && "ing..."}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>

                {/* {state.imgUrl && (
                  <img src={state.imgUrl} alt="uploaded file" height={200} />
                )} */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const Marker = (props) => {
  const { address } = props
  return (
    <div className="relative flex flex-col items-center group">
      <div
        className="w-5 h-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 50 50"
        fill="currentColor"
      >
        <div
          className={`pin`}
          style={{ backgroundColor: "red", cursor: "pointer" }}
          title={address}
        />
        <div className="pulse" />
      </div>
    </div>
  )
}
