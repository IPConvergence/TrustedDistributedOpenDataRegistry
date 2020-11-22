// SPDX-License-Identifier: EUPL V1.2
//pragma solidity ^0.5.16;
pragma solidity ^0.7.0;

/** @title ODTAStorage SC is in charge of managing Diamond Storage Capability for the Trust Anchors
    @author Marc-Antoine Lemaire from Company IP Convergence
    @notice version 0.1, on 17 november 2020
 */
contract ODTAStorage {
    // State variable to have a unique position on memory to store the struct
    bytes32 public constant ODTAStorage_DIAMOND_STORAGE_POSITION = keccak256(
        "diamond.standard.ODTA.storage"
    );

    struct ODTA {
        uint256 _version;
    }

     /** @dev Funtion that creates a Diamond Storage to store the ODTA struct and returns the storage pointer to the ODTA Struct
    */
    function odtaStorage() internal pure returns (ODTA storage ms) {
        bytes32 position = ODTAStorage_DIAMOND_STORAGE_POSITION;
        assembly {
            ms.slot := position
        }
    }
}