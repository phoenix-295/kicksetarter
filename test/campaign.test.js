const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiled_factory = require("../etherium/build/CampaignFactory.json");
const compiled_camp = require("../etherium/build/Campaign.json");
const { it } = require("mocha");

let accounts;
let factory;
let campaignAddress;
let campaign;

// console.log("Evm", compiled_factory.evm.bytecode.object);
// console.log("ABI", compiled_factory.abi);

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiled_factory.abi)
    .deploy({ data: compiled_factory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "2000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiled_camp.abi, campaignAddress);
  //console.log("Campaign", campaign.options.address);
  //console.log("Factory", factory.options.address);
});

describe("Inbox", () => {
  it("Deploy a contract", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("Manager is accounts[0]", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it("Allows contrubution and allows them to be approvers", async () => {
    await campaign.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });
    const is_cont = await campaign.methods.approvers(accounts[1]).call();
    assert(is_cont);
  });

  it("Requires minimum Contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        value: 5,
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it("Allows manager to make payment request", async () => {
    await campaign.methods
      .create_request("buy paint", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });
    const req = await campaign.methods.requests(0).call();
    assert.equal("buy paint", req.description);
    assert.equal(100, req.value);
  });

  it("Processes requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .create_request("buy paint", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approve_request(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
