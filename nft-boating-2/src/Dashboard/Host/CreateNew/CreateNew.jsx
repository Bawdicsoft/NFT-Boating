import { useForm } from "react-hook-form"
import { useContextAPI } from "./../../../ContextAPI"
import { useWeb3React } from "@web3-react/core"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import { Injected } from "./../../../Comp/Wallets/Connectors"
import { useEffect } from "react"
import axios from "axios"
import { auth, db } from "./../../../DB/firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"
import QRCode from "react-qr-code"
import html2canvas from "html2canvas"
import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore"

const createTicketFunc = async () => {
  html2canvas(document.getElementById("HTML-IMG")).then(async (canvas) => {
    const API_KEY = "52204a85c1a51d7f3ed2"
    const API_SECRET =
      "4b678ed52b09e15f4cb39c5db0f49365d9bae9d1914605648d2137e4cd937e36"

    const URLforpinJSONtoIPFS = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

    axios
      .post(
        URLforpinJSONtoIPFS,
        {
          name: "name",
          description: "description",
          image: canvas.toDataURL(),
          attributes: [
            {
              trait_type: "trait",
              value: 100,
            },
          ],
        },
        {
          headers: {
            pinata_api_key: API_KEY,
            pinata_secret_api_key: API_SECRET,
          },
        }
      )
      .then(async (response) => {
        console.log("responseFromFiletoIPFS: ", response.data.IpfsHash)
      })
      .catch((error) => {
        console.log(error)
      })
  })
}

export default function CreateNew() {
  const { account, active, activate } = useWeb3React()
  const [user, error] = useAuthState(auth)
  const { ContractDeploy, UserData, updateDocRequests, fetchUser } =
    useContextAPI()
  const navigate = useNavigate()

  const [State, SetState] = useImmer({
    SetBtnDisable: false,
    haveRequest: null,
    executionReverted: false,
    request: {},
  })

  console.log(State.request)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const xyz = async () => {
    const docRef = doc(db, "users", UserData.id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().request)
      if (docSnap.data().request !== undefined) {
        SetState((d) => {
          d.request = docSnap.data().request
          d.haveRequest = true
        })
      } else {
        SetState((d) => {
          d.haveRequest = false
        })
      }
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!")
      SetState((d) => {
        d.haveRequest = false
      })
    }
  }

  useEffect(() => {
    if (UserData === undefined) {
      return
    } else {
      xyz()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (UserData === undefined) {
      return
    } else {
      xyz()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserData])

  const onSubmit = async (data) => {
    console.log({ data })

    SetState((draft) => {
      draft.SetBtnDisable = true
    })

    html2canvas(document.getElementById("HTML-IMG")).then(async (canvas) => {
      const API_KEY = "6486e5c40cd049a8d0d1"
      const API_SECRET =
        "f8ffade9a388141c898be2d960ba8e52e1a2ef45717469caf9d9985ab68ad2bb"

      const URLforpinJSONtoIPFS = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

      axios
        .post(
          URLforpinJSONtoIPFS,
          {
            name: State.request.name,
            description: State.request.description,
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
          console.log("responseFromFiletoIPFS: ", response.data.IpfsHash)

          try {
            await ContractDeploy.deploy(
              State.request.name,
              State.request.name.slice(0, 1),
              "365",
              State.request.price,
              account,
              `ipfs://${response.data.IpfsHash}/`
            )
          } catch (e) {
            console.log(e.reason)
            SetState((draft) => {
              draft.SetBtnDisable = false
              draft.executionReverted = true
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    })

    ContractDeploy.on("deploy_", async (_Contract) => {
      try {
        await setDoc(doc(db, "ContractInfo", _Contract), {
          featuredImage: State.request.featuredImage,
          coverImage: State.request.coverImage,
          name: State.request.name,
          year: State.request.year,
          make: State.request.make,
          model: State.request.model,
          price: State.request.price,
          walletAddress: account,
          email: UserData.email,
          description: State.request.description,
        })
      } catch (error) {
        console.error(error)
      }

      try {
        await updateDocRequests("users", {
          request: deleteField(),
        })
      } catch (error) {
        console.error(error)
      }

      const Mail = {
        fromName: "NFT Boating",
        from: "nabeelatdappvert@gmail.com",
        to: `nabeelatdappvert@gmail.com, ${UserData.email}`,
        subject: "New Smart Contract Deployed",
        text: `New Smart Contract Deployed \n
        contract address: ${_Contract} \n
        email: ${UserData.email}`,
      }
      const res = await axios.post("http://localhost:8080/email", Mail)
      console.log(res.data.msg)

      fetchUser()
      navigate(`/Boat/${_Contract}`)
    })
  }
  console.log(errors)

  const connectWithMetaMask = async () => {
    await activate(Injected)
  }

  return (
    <div className="CreateNew min-h-full">
      <header className="bg-white">
        <div className="mt-20 mb-20 text-center">
          <h1 className="mb-1 font-bold text-5xl "> List Your Boat </h1>
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
                {State.haveRequest ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="shadow sm:rounded-md">
                      <div className="px-4 py-5 bg-white sm:p-6">
                        <div
                          id="HTML-IMG"
                          className="mb-4 relative h-[300px] w-[300px]"
                        >
                          <img
                            src={State.request.featuredImage}
                            alt=""
                            className=""
                          />
                          <div className="absolute bottom-1 w-full justify-center flex ">
                            <img
                              src="https://firebasestorage.googleapis.com/v0/b/nft-yacht.appspot.com/o/assets%2FlogoNFTBoating.png?alt=media&token=4267a8e3-37bc-4223-90f9-6e63501382bc"
                              alt=""
                              className="w-[180px]"
                            />
                            <div className="px-1 py-1 bg-white">
                              <QRCode value={"Hello"} size="70" />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-6 gap-4">
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Name
                            </label>
                            <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                              {State.request.name}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Price (USDT)
                            </label>
                            <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                              {State.request.price}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-6">
                            <label
                              htmlFor="last-name"
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Owner Address
                            </label>
                            <p className="w-full py-2.5 px-3 border mb-4 rounded-md">
                              {account ? account : "Connect your Wallet"}
                            </p>
                          </div>

                          <div className="col-span-6 sm:col-span-6">
                            {!active ? (
                              <span
                                onClick={connectWithMetaMask}
                                className=" cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Connect With MetaMask
                              </span>
                            ) : (
                              <>
                                {State.executionReverted && (
                                  <span className="text-red-500">
                                    your request is not accepted yet. you will
                                    receive an confirmation email
                                  </span>
                                )}
                                <button
                                  className="mt-4 cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                  type="submit"
                                  disabled={State.btnDisable}
                                >
                                  Create
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="max-w-sm mx-auto text-center">
                    <h1 className="text-2xl	">You did not submit any request</h1>
                    <p className="mb-3">
                      Please go Become a Host page and submit your request
                    </p>
                    <Link
                      className=" cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      to="/list-boat"
                    >
                      Become a Host
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
