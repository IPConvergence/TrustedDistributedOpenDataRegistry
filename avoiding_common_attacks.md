Which security steps are taken, what measures to ensure your contracts are not susceptible to common attacks?

ODTAValidator.sol has been validated by MythX.io tool.

The following SmartContract Weakness Classitication has been identified with MythX and have been fixed:

- SWC 103: Floating Pragma (low security severity)
  -> Contracts should be deployed with the same compiler version and flags that they have been tested with thoroughly.
  -> Truffle is using solc 0.5.16
  -> pragma solidity ^0.5.16; // has been inserted on ODTAValidator.sol

- SWC-108: State Variable Default Visibility
    -> "address owner;" change to "address internal owner;"


Please refer to https://app.gitbook.com/@marcantoine-lemaire/s/solidity/open-data-trusted-anchors-project#smartcontract-design for the description of the mecanims put in place
Circuit breaker has been put also in place
Math lib has been use to avoid overflow attack by re-entrancy -> https://app.gitbook.com/@marcantoine-lemaire/s/solidity/open-data-trusted-anchors-project#smartcontract-design
Plus quality testing done with MythX, explanation here: https://app.gitbook.com/@marcantoine-lemaire/s/solidity/open-data-trusted-anchors-project#testing-code-security-quality

