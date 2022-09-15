import { useEffect } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useImmer } from "use-immer"
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "../../../DB/firebase-config"

export default function AllUsers() {
  const [user, loading] = useAuthState(auth)

  const [state, setState] = useImmer({
    users: [],
  })

  useEffect(() => {
    if (loading) {
      return
    } else {
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(db, "users"))
        console.log(">>>>>>", querySnapshot)
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data())

          setState((d) => {
            d.users.push(doc.data())
          })
        })
      }
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div className="OffersReceived min-h-full">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">All Request</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="py-2">
              <div className="-mx-4 sm:-mx-14 px-4 sm:px-8 py-4 overflow-x-auto">
                <div className="inline-block min-w-full shadow-md rounded-lg overflow-hidden">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Auth Provider
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          img
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.users.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-600 whitespace-no-wrap">
                                {item.name}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {item.email}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <p className="text-gray-900 whitespace-no-wrap">
                                {item.authProvider}
                              </p>
                            </td>
                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                              <img
                                src={item.photoURL}
                                className="w-10 rounded-full"
                                alt=""
                              />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
