import { Fragment, useEffect, useState } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { BellIcon, MenuIcon, CashIcon, XIcon } from "@heroicons/react/outline"
import { Link, useNavigate } from "react-router-dom"
import { auth, db, logout, signInWithGoogle } from "../../DB/firebase-config"
import { useAuthState } from "react-firebase-hooks/auth"
import WalletSide from "./WalletSide"
import logo from "../../Assets/logo.png"
import { useImmer } from "use-immer"
import { collection, getDocs } from "firebase/firestore"
import { useWeb3React } from "@web3-react/core"
import { useContextAPI } from "../../ContextAPI"

const navigation = [
  { name: "Home", href: "/", current: false },
  { name: "Boats", href: "/home", current: false },
  { name: "List Your Boat", href: "/list-boat" },
  { name: "About", href: "/about", current: false },
]
const userNavigation = [
  { name: "NFT Collection", href: "/collected" },
  { name: "Booked Date", href: "/booked-date" },
  { name: "Offers Made", href: "/offers-made" },
]
const hostNavigation = [
  { name: "Boats", href: "/Boats" },
  { name: "List Your Boat", href: "/create-new" },
]
const adminNavigation = [
  { name: "All Users", href: "/all-users" },
  { name: "Requsts", href: "/requsts" },
  { name: "Booked Dates", href: "/booked-dates" },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function Header() {
  const { UserData } = useContextAPI()

  console.log({ UserData })
  const { active, account } = useWeb3React()
  const [user, loading, error] = useAuthState(auth)
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const logoutFunc = async () => {
    await logout()
    navigate(`/`)
  }

  const [state, setState] = useImmer({
    role: "user",
    requstLength: null,
  })

  useEffect(() => {
    if (loading) {
      return
    } else {
      setState((e) => {
        e.role = UserData?.role
      })

      const fetchData = async () => {
        if (1 > 0) {
          try {
            const doc = await getDocs(collection(db, "Requst"))
            const data = doc.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            console.log(">>>>>>>>>>>")
            console.log("data", data.length)
            setState((e) => {
              e.requstLength = data.length
            })
          } catch (error) {
            console.log(error)
          }
        }
      }
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])
  console.log(error)

  return (
    <>
      <WalletSide open={open} setOpen={setOpen} />

      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img className="h-[60px]" src={logo} alt="Workflow" />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      {!user ? (
                        <button
                          onClick={signInWithGoogle}
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                            />
                          </svg>
                          Sign in to Gmail
                        </button>
                      ) : (
                        <>
                          {/* <button
                            type="button"
                            className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                          >
                            <span className="sr-only">View notifications</span>
                            <p
                              className="text-Yellow-500"
                              style={{
                                position: "relative",
                                bottom: "-5px",
                                right: "-5px",
                              }}
                            >
                              {state.requstLength}
                            </p>
                            <BellIcon
                              style={{
                                position: "relative",
                                top: "-12px",
                              }}
                              className="h-6 w-6 "
                              aria-hidden="true"
                            />
                          </button> */}
                          {active ? (
                            <button
                              onClick={() => setOpen(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              {account.slice(0, 4)}...{account.slice(-4)}
                            </button>
                          ) : (
                            <button
                              onClick={() => setOpen(true)}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Connect To Wallet
                            </button>
                          )}
                          <Menu as="div" className="ml-3 relative">
                            <div>
                              <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                                <span className="sr-only">Open user menu</span>
                                <img
                                  className="h-8 w-8 rounded-full"
                                  src={user?.photoURL}
                                  alt="img"
                                />
                              </Menu.Button>
                            </div>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="origin-top-right z-50 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {userNavigation.map((item) => (
                                  <Menu.Item key={item.name}>
                                    {({ active }) => (
                                      <Link
                                        to={item.href}
                                        className={classNames(
                                          active ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700"
                                        )}
                                      >
                                        {item.name}
                                      </Link>
                                    )}
                                  </Menu.Item>
                                ))}

                                {UserData?.host && (
                                  <>
                                    <hr />

                                    {hostNavigation.map((item) => (
                                      <Menu.Item key={item.name}>
                                        {({ active }) => (
                                          <Link
                                            to={item.href}
                                            className={classNames(
                                              active ? "bg-gray-100" : "",
                                              "block px-4 py-2 text-sm text-gray-700"
                                            )}
                                          >
                                            {item.name}
                                          </Link>
                                        )}
                                      </Menu.Item>
                                    ))}
                                  </>
                                )}

                                {UserData?.admin && (
                                  <>
                                    <hr />

                                    {adminNavigation.map((item) => (
                                      <Menu.Item key={item.name}>
                                        {({ active }) => (
                                          <Link
                                            to={item.href}
                                            className={classNames(
                                              active ? "bg-gray-100" : "",
                                              "block px-4 py-2 text-sm text-gray-700"
                                            )}
                                          >
                                            {item.name}
                                          </Link>
                                        )}
                                      </Menu.Item>
                                    ))}
                                  </>
                                )}
                                <hr />

                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={logoutFunc}
                                      className={classNames(
                                        active ? "bg-gray-100" : "",
                                        "w-full text-start block px-4 py-2 text-sm text-gray-700"
                                      )}
                                    >
                                      Logout
                                    </button>
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                          {/* <CashIcon className="h-6 w-6" aria-hidden="true" /> */}
                        </>
                        //   <svg onClick={() => setOpen(true)} xmlns="http://www.w3.org/2000/svg" className="rounded-full cursor-pointer h-6 w-6 ml-4 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        //   <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />

                        //   <WalletSide open={open} setOpen={setOpen}/>
                        // </svg>
                      )}
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <MenuIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block px-3 py-2 rounded-md text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user?.displayName}
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">
                        {user?.displayName}
                      </div>
                      <div className="text-sm font-medium leading-none text-gray-400">
                        {user?.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto bg-gray-800 flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  )
}
