import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

// MetaMask
export const Injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 1337],
});

export const CoinbaseWallet = new WalletLinkConnector({
  url: `https://${process.env.REACT_APP_CONTRACT_NETWORK_NAME}.infura.io/v3/${process.env.REACT_APP_INFURA_ID}}`,
  appName: "NFT Boating",
});

export const walletConnect = new WalletConnectConnector({
  rpc: {
    1: `https://${process.env.REACT_APP_CONTRACT_NETWORK_NAME}.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
  },
  infuraId: `${process.env.REACT_APP_INFURA_ID}`,
  bridge: "https://bridge.walletconnect.org",
  chainId: process.env.REACT_APP_CONTRACT_NETWORK_ID,
  qrcode: true,
  pollingInterval: 12000,
});
