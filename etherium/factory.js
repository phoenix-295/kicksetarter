import web3 from "./web3";

import CampaignFactory from "./build/CampaignFactory.json" assert { type: "json" };

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  "0x84Bc6424C6275D2597888df84D1E14bf0020B72C"
);

export default instance;
  