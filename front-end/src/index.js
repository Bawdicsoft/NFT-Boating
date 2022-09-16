import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import { Web3Provider } from "@ethersproject/providers"
import { BrowserRouter } from "react-router-dom"
import { ContextProvider } from "./ContextAPI"
import { Web3ReactProvider } from "@web3-react/core"

const root = ReactDOM.createRoot(document.getElementById("root"))

const getLibrary = (provider) => {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

root.render(
  <BrowserRouter>
    <Web3ReactProvider getLibrary={getLibrary}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </Web3ReactProvider>
  </BrowserRouter>
)
