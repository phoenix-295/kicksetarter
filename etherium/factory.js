import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json" assert { type: "json" };

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x4F1662048A118a63c6eE493ba6e1f3fFf85b8d46"
);

export default instance;
  