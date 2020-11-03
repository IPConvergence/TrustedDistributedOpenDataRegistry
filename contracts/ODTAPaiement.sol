// SPDX-License-Identifier: EUPL V1.2
pragma solidity <=0.8.0;

contract ODTAPaiement{
    
    function withdraw() public {
        msg.sender.transfer(address(this).balance);
    }
     
     function() payable external {
        // nothing to do!
    }
    
     function deposit(uint256 amount) payable public {
        require(msg.value == amount);
        // nothing else to do!
    }
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

}