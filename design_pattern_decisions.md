Which design patterns are used on the ODTA Project?

Please refer to https://app.gitbook.com/@marcantoine-lemaire/s/solidity/open-data-trusted-anchors-project#smartcontract-design
for the explanation on Design Pattern used

Use Library: SafeMath.sol -> to avoid overflow and underlow issue (see herer to use it https://ec.europa.eu/cefdigital/code/projects/EBSI/repos/besu-sc-trusted-apps-registry/browse/contracts/utils/math?at=refs%2Fheads%2Fint)

Used Circuit breaker, use Gnosis multisig wallet for operator, use also Diamond Storage for the SC Version with Assembly code, but refer to the gitbook here above done for the project.