import { useForm } from "react-hook-form"
import { useContextAPI } from "./../../../ContextAPI"
import { useWeb3React } from "@web3-react/core"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import { Injected } from "./../../../Comp/Wallets/Connectors"
import { useEffect } from "react"
import axios from "axios"
import { db } from "./../../../DB/firebase-config"
import { deleteField, doc, getDoc, setDoc } from "firebase/firestore"

export default function CreateNew() {
  const { account, active, activate } = useWeb3React()
  const { ContractDeploy, UserData, updateDocRequests, fetchUser } =
    useContextAPI()
  const navigate = useNavigate()

  const [State, SetState] = useImmer({
    SetBtnDisable: false,
    haveRequest: null,
    executionReverted: false,
    request: {},
    isWhiteListed: true,
    isRightAccount: true,
  })

  console.log(State.isWhiteListed, State.isRightAccount)

  const {
    handleSubmit,
    formState: { errors },
  } = useForm()

  const fetchUserData = async () => {
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
      fetchUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (UserData === undefined) {
      return
    } else {
      fetchUserData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserData])

  const isWhiteListed = async () => {
    const whitelist = await ContractDeploy.whitelist(State.request.account)
    console.log("isWhiteListed", whitelist)

    SetState((e) => {
      e.isWhiteListed = whitelist
      e.isRightAccount = Boolean(State.request.account === account)
    })
  }

  useEffect(() => {
    isWhiteListed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  const onSubmit = async (data) => {
    console.log("State.request", State.request)

    SetState((draft) => {
      draft.SetBtnDisable = true
    })

    try {
      await ContractDeploy.deploy(
        State.request.name,
        State.request.name.slice(0, 1),
        "365",
        State.request.amount,
        State.request.account,
        `ipfs://${State.request.IpfsHash}`
      )
    } catch (e) {
      console.log(e)
      SetState((draft) => {
        draft.SetBtnDisable = false
        draft.executionReverted = true
      })
    }

    ContractDeploy.on("deploy_", async (_Contract) => {
      try {
        await setDoc(doc(db, "ContractInfo", _Contract), State.request)
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
                  <th>Confirmation</th>
                </tr>
                <tr style="background-color: #eaeaea">
                  <td>New Boat Listed</td>
                </tr>
                <tr>
                  <th>Listed Boat Name</th>
                </tr>
                <tr style="background-color: #eaeaea">
                  <td>${State.request.name}</td>
                </tr>
                <tr>
                  <th>Boat Lister Email</th>
                </tr>
                <tr style="background-color: #eaeaea">
                  <td>${UserData.email}</td>
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
      const res = await axios.post(
        "https://nft-boating-mail.herokuapp.com/email",
        Mail
      )
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
        </div>
      </header>
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mt-5 md:mt-0 md:col-span-2">
            {State.haveRequest ? (
              <>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="shadow sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <img
                        src={State.request.featuredImage}
                        alt=""
                        className="w-[300px] mb-6"
                      />

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
                            {State.request.amount}
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
                            {State.request.account}
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
                              {!State.isWhiteListed ? (
                                <p>
                                  your request is padding please Wat 1 or 2
                                  business days after your request is accepted
                                  you will get an email
                                </p>
                              ) : (
                                <>
                                  {!State.isRightAccount ? (
                                    <p>
                                      please change your account to requested
                                      account {State.request.account}
                                    </p>
                                  ) : (
                                    <button
                                      className="cursor-pointer w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                      type="submit"
                                      disabled={State.btnDisable}
                                    >
                                      List your Boat
                                    </button>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </>
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
      </main>
    </div>
  )
}
