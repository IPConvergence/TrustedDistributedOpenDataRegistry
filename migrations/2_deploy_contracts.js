const ODTAValidators = artifacts.require("ODTAValidator");

module.exports = function (deployer) {
  deployer.deploy(ODTAValidators);
};