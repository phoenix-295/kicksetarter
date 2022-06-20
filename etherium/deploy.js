const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const CampaignFactory = require("./build/CampaignFactory.json");
require("dotenv").config();

let mnemonic = process.env.MNEMONIC;
let api = process.env.API;

const provider = new HDWalletProvider(mnemonic, api);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Account", accounts[0]);
  const result = await new web3.eth.Contract(CampaignFactory.abi)
    .deploy({ data: CampaignFactory.evm.bytecode.object })
    .send({ gas: "5000000", from: accounts[0] });
  console.log(CampaignFactory.abi);
  console.log("Contract deployed, address:", result.options.address);
  provider.engine.stop();
};
deploy();

// 0x0f1326a7Ca9B2fd64283aDA2e806009BE84707E8
// 0x0f1326a7Ca9B2fd64283aDA2e806009BE84707E8
