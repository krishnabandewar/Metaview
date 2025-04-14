import Web3 from 'web3';

let web3;

const SEPOLIA_CHAIN_ID = '0xaa36a7'; // Chain ID for Sepolia

const setupNetwork = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CHAIN_ID }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: SEPOLIA_CHAIN_ID,
            chainName: 'Sepolia Test Network',
            nativeToken: {
              name: 'Sepolia ETH',
              symbol: 'ETH',
              decimals: 18
            },
            rpcUrls: [`${process.env.REACT_APP_QUICKNODE_HTTP_URL}`],
            blockExplorerUrls: ['https://sepolia.etherscan.io/']
          }],
        });
      } catch (addError) {
        console.error('Error adding Sepolia network:', addError);
      }
    }
  }
};

if (window.ethereum) {
    window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(() => {
            web3 = new Web3(window.ethereum);
        })
        .catch((error) => {
            console.error("User denied account access", error);
        });
} else {
    console.error("Please install MetaMask!");
}

export const getWeb3 = () => {
    return web3;
};