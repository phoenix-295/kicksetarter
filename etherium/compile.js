const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const camp_path = path.resolve(__dirname, "contracts", "Contracts_factory.sol");
const source = fs.readFileSync(camp_path, "utf8");

var input = {
  language: "Solidity",
  sources: {
    "Contracts_factory.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

console.log(output);

fs.ensureDirSync(buildPath);

Object.keys(input["sources"]).forEach((source) => {
  Object.keys(output[source]).forEach((contract) => {
    console.log("writing to file", contract);
    fs.outputJsonSync(
      path.resolve(buildPath, contract + ".json"),
      output[source][contract]
    );
  });
});
