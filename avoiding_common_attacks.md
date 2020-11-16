Which security steps are taken, what measures to ensure your contracts are not susceptible to common attacks?

ODTAValidator.sol has been validated by MythX.io tool.

The following SmartContract Weakness Classitication has been identified with MythX and have been fixed:

- SWC 103: Floating Pragma (low security severity)
  -> Contracts should be deployed with the same compiler version and flags that they have been tested with thoroughly.
  -> Truffle is using solc 0.5.16
  -> pragma solidity ^0.5.16; // has been inserted on ODTAValidator.sol

- SWC-108: State Variable Default Visibility
    -> "address owner;" change to "address internal owner;"

- SWC-131: Presence of unused variables
    -> owner variable is not used
    -> Implement a circuit breaker with it !!! tbd

