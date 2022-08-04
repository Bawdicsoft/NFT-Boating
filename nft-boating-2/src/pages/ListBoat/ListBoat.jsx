import { useForm } from "react-hook-form"
import { useImmer } from "use-immer"
import QRCode from "react-qr-code"
import logo from "./../../Assets/logo.png"
import { collection, addDoc } from "firebase/firestore"
import axios from "axios"
// import { useNavigate } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { db, storage } from "../../DB/firebase-config"
import { useContextAPI } from "../../ContextAPI"
import html2canvas from "html2canvas"
import GoogleMapReact from "google-map-react"
import { useContext, useEffect, useState } from "react"
import { async } from "@firebase/util"
import Popup from "./Popup"
import Map from "../../Comp/Map/Map"
import DispatchContext from "../../DispatchContext"

export default function ListBoat() {
  const appDispatch = useContext(DispatchContext)
  const { updateDocRequests, UserData } = useContextAPI()
  const { account } = useWeb3React()
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
    coverImageData: null,
    markerLoading: true,
    markerMap: {
      lat: 25.761681,
      lng: -80.191788,
      address: null,
      status: "null",
    },
  })

  const [open, setOpen] = useState(false)

  const location = watch(["location"])
  useEffect(() => {
    const runMap = async () => {
      if (state.markerMap.address !== location[0] && location[0] !== "") {
        try {
          const res = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${location[0]}&key=AIzaSyCtSZl9y1AEVHZhs0wrhhtmK7RunH71K5k`
          )

          if (res.data.status === "OK") {
            console.log("OK")
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
  }, [location])

  const featuredImage = watch(["featuredImage"])
  useEffect(() => {
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
  }, [featuredImage])

  const coverImage = watch(["coverImage"])
  useEffect(() => {
    if (coverImage[0] !== undefined) {
      if (coverImage[0].length > 0) {
        const reader = new FileReader()
        reader.addEventListener("load", () => {
          setState((e) => {
            e.coverImageData = reader.result
          })
        })
        reader.readAsDataURL(coverImage[0][0])
      }
    }
  }, [coverImage])

  const onSubmit = async (e) => {
    if (state.markerMap.status === "OK") {
      setOpen(true)
      setState((draft) => {
        draft.btnLoading = true
      })

      html2canvas(document.getElementById("HTML-IMG"), {
        allowTaint: true,
        useCORS: true,
      }).then(async (canvas) => {
        const API_KEY = "6486e5c40cd049a8d0d1"
        const API_SECRET =
          "f8ffade9a388141c898be2d960ba8e52e1a2ef45717469caf9d9985ab68ad2bb"

        const URLforpinJSONtoIPFS = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

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
            const storageRef = ref(storage, `files/${file.name}`)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setState((e) => {
                  e.progresspercent = progress
                })
              },
              (error) => {
                alert(error)
              },
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then(
                  (featuredImageURL) => {
                    const file = e.coverImage[0]

                    if (!file) return

                    const storageRef = ref(storage, `files/${file.name}`)
                    const uploadTask = uploadBytesResumable(storageRef, file)

                    uploadTask.on(
                      "state_changed",
                      (snapshot) => {
                        const progress = Math.round(
                          (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100
                        )
                        setState((e) => {
                          e.progresspercent = progress
                        })
                      },
                      (error) => {
                        alert(error)
                      },
                      () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                          async (coverImageURL) => {
                            const request = {
                              featuredImage: featuredImageURL,
                              coverImage: coverImageURL,
                              name: e.name,
                              phone: e.phone,
                              year: e.year,
                              make: e.make,
                              model: e.model,
                              price: e.price,
                              location: e.location,
                              walletAddress: account,
                              IpfsHash: response.data.IpfsHash,
                              description: e.description,
                            }

                            try {
                              await addDoc(collection(db, "Requst"), {
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
                              from: "nabeelatdappvert@gmail.com",
                              to: `nabeelatdappvert@gmail.com ${UserData.email} `,
                              subject: "You have new request from NFT Boation",
                              text: `featuredImage: ${featuredImageURL} \n
                              coverImage: ${coverImageURL} \n
                              name: ${e.name} \n
                              phone: ${e.phone} \n
                              email: ${UserData.email} \n
                              year: ${e.year} \n
                              make: ${e.make} \n
                              model: ${e.model} \n
                              price: ${e.price} \n
                              location: ${e.location} \n
                              walletAddress: ${account} \n
                              description: ${e.description}`,
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
                                    <h1 style="text-align: center">NFT Boading</h1>
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
                                        <th>Year</th>
                                      </tr>
                                      <tr style="background-color: #eaeaea">
                                        <td>${e.year}</td>
                                      </tr>
                                      <tr>
                                        <th>Make</th>
                                      </tr>
                                      <tr style="background-color: #eaeaea">
                                        <td>${e.make}</td>
                                      </tr>
                                      <tr>
                                        <th>Model</th>
                                      </tr>
                                      <tr style="background-color: #eaeaea">
                                        <td>${e.model}</td>
                                      </tr>
                                      <tr>
                                        <th>Price</th>
                                      </tr>
                                      <tr style="background-color: #eaeaea">
                                        <td>${e.price}</td>
                                      </tr>
                                      <tr>
                                        <th>Location</th>
                                      </tr>
                                      <tr style="background-color: #eaeaea">
                                        <td>${e.location}</td>
                                      </tr>
                                      <tr>
                                        <th>Wallet Address</th>
                                      </tr>
                                      <tr style="background-color: #eaeaea">
                                        <td>${account}</td>
                                      </tr>
                                      <tr>
                                        <th>Description</th>
                                      </tr>
                                      <tr style="background-color: #eaeaea">
                                        <td>${e.description}</td>
                                      </tr>
                                    </table>
                                    <br />
                                    <p style="text-align: center">
                                      <a href="https://">CopyRight: NFT Boading</a>
                                    </p>
                                  </div>
                                </body>
                              </html>
                              `,
                            }

                            const res = await axios.post(
                              "http://localhost:8080/email",
                              Mail
                            )
                            console.log(res.data)

                            setState((e) => {
                              e.btnLoading = false
                            })
                            setOpen(false)
                          }
                        )
                      }
                    )
                  }
                )
              }
            )
          })
          .catch((error) => {
            console.error(error)
          })
      })
    } else {
      console.error("Please Check Your address")
    }
  }
  console.log(errors)

  return (
    <div className="CreateNew min-h-full">
      <Popup open={open} setOpen={setOpen} state={state} />
      <header className="bg-white">
        <div className="mt-20 mb-20 text-center">
          <h1 className="mb-1 font-bold text-5xl "> Become a Host </h1>
          <div className="max-w-3xl mx-auto text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Cumque
            ipsa commodi accusamus cupiditate blanditiis nihil voluptas
            architecto numquam, omnis delectus?
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div>
                <h2 className="text-1xl font-extrabold tracking-tight text-gray-900 sm:text-2xl">
                  Technical Specifications
                </h2>
                <p className="mt-4 text-gray-500">
                  The walnut wood card tray is precision milled to perfectly fit
                  a stack of Focus cards. The powder coated steel divider
                  separates active cards from new ones, or can be used to
                  archive important task lists.
                </p>

                <dl className="mt-8 grid grid-cols-1 gap-x-6 gap-y-7 lg:gap-x-8">
                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">Origin</dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      Designed by Good Goods, Inc.
                    </dd>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <dt className="font-medium text-gray-900">
                      Considerations
                    </dt>
                    <dd className="mt-2 text-sm text-gray-500">
                      Made from natural materials. Grain and color vary with
                      each item.
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="shadow sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Name
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

                        {/* <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Total Supply
                          </label>
                          <input
                            type="number"
                            placeholder="Total Supply"
                            {...register("totalSupply", {
                              required: true,
                              maxLength: 365,
                            })}
                            className="w-full py-2.5 px-3 border mb-4 rounded-md"
                          />
                        </div> */}

                        <div className="col-span-6 sm:col-span-3">
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Price (USDT)
                          </label>
                          <input
                            type="number"
                            id="price"
                            placeholder="Price (USDT)"
                            {...register("price", {
                              required: true,
                              minLength: 1,
                            })}
                            className="w-full py-2.5 px-3 border  rounded-md"
                          />
                          <p className="mt-2 text-sm text-gray-500 mb-4">
                            What you wanna charge in (USDT)
                          </p>
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
                            className="w-full py-2.5 px-3 border  mb-4 rounded-md"
                          >
                            {account ? (
                              account
                            ) : (
                              <span className="text-red-600">
                                Connect MetaMask
                              </span>
                            )}
                          </p>
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
                                  key: "AIzaSyCtSZl9y1AEVHZhs0wrhhtmK7RunH71K5k",
                                }}
                                center={{
                                  lat: state.markerMap.lat,
                                  lng: state.markerMap.lng,
                                }}
                                defaultZoom={5}
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
                                      multiple
                                      {...register("featuredImage", {
                                        required: true,
                                      })}
                                    />
                                  </label>
                                  <p className="pl-1">Size should be 1x1</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                            <div className="flex  justify-center">
                              {state.featuredImageData && (
                                <div
                                  id="HTML-IMG"
                                  className="mt-4 relative h-[300px] w-[300px]"
                                >
                                  <img src={state.featuredImageData} />
                                  <div className="absolute bottom-1 w-full justify-center flex ">
                                    <img src={logo} className="w-[180px]" />
                                    <div className="px-1 py-1 bg-white">
                                      <QRCode value={"Hello"} size={70} />
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6 sm:col-span-6 mb-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Cover Image
                          </label>
                          <div className="mt-1 px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className=" flex justify-center ">
                              <div className="space-y-1 text-center">
                                <div className="flex text-sm text-gray-600">
                                  <label
                                    htmlFor="coverImage"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                  >
                                    <span>Upload a file</span>
                                    <input
                                      type="file"
                                      className="sr-only"
                                      id="coverImage"
                                      multiple
                                      {...register("coverImage", {
                                        required: true,
                                      })}
                                    />
                                  </label>
                                  <p className="pl-1">Size should be 16x9</p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                            <img
                              className="w-full mt-4"
                              src={state.coverImageData}
                            />
                          </div>
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
    <>
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
    </>
  )
}
