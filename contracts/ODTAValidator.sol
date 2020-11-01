// SPDX-License-Identifier: EUPL V1.2
pragma solidity <=0.8.0;

/** @title ODTAValidator SC is in charge of managing DataAsset Trust Anchors
    @author Marc-Antoine Lemaire from Company IP Convergence
    @notice version 0.1, on 1 november 2020
 */
contract ODTAValidator{
// ------------ Define the States Variables of the SC ----------------

// -- Objects used by Data Producer --
    address owner;
    /// dataProducerStore = mapping of dataProducerID Address to the list of dataAssetID produced by him
    mapping (address => bytes32[]) public dataProducerStore;
    /// dataProdudcerDataAssetList = An array of dataAssetID produced by a dataProducerID
    bytes32[] public dataProducerDataAssetList;

// -- Objects used for managing Data Asset --
    /// dataAssetIDList = array of all the dataAssetID managed by the SC
    bytes32[] public dataAssetIDList;
    /// dataAssetObject = structure that containes all required Data Asset Information to manage Trust and access control from SC
    struct dataAssetObject{
        address dataAssetProducerID;
        accessType dataAssetAccessType;
        string dataAssetAccessPrice; // in Ether
        string dataAssetAccessDuration; // in Number of days
        bytes32 proofOfIntegrigyDataAsset;
        bytes32 proofOfSourceAuthenticity;
        bytes32 proofOfIntegrityUseProcessingConditions;
    }
    /// dataAssetStore = mapping of all the dataAssetID (Hash of DataAsset) and their linked dataAssetObject
    mapping (bytes32 => dataAssetObject) public dataAssetStore;

// -- Objects used for managing Access to the Data Asset --
    /// accessType : enum saying if the access is free or you must pay
    enum accessType {free, paying}
    /// dataAssetAccessObject = structure that contains the access parameter for a Data Asset
    struct dataAssetAccessObject{
        bool dataAssetAccessStatus;
        string dataAssetAccessStartDate;
        string dataAssetAccessEndDate;
    }
    /// dataAssetAccessStore = mapping of all the dataAssetID to the mapping of their dataConsumerID address to their dataAssetAccessObject
    mapping (bytes32 => mapping(address => dataAssetAccessObject)) public dataAssetAccessStore;

// -- Events needed to manage notification on operation on DataAsset --
    /// eventGetDataAccess = event to be generated every time a DataAssetConsumerID getAccess to a Data Asset
    event eventGetDataAccess(address _dataAssetProducerID, address _dataAssetConsumerID, bytes32 _dataAssetID);

// -- Modifier needed to perfom different control on some SC Data Asset --
    /// isOwner modifer: checks if the msg.sender is the owner of the contract
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

// ------------ Define functions of the SC ----------------

    /** @dev Constructor of the ODTAValidator SmartContract
    */
    constructor() public{
        /* set the owner as the person who instantiated the contract. */
        owner = msg.sender;
    }

    /** @dev Function in charge of inserting a Data Asset on SC
        @param _dataAssetProducerID Address of the dataAsset
        @param _dataAssetAccessType Type of access {free, paying}
        @param _dataAssetAccessPrice Price in Ether set by the Data Producer to access the Data Asset, if paying one
        @param _dataAssetAccessDuration Duration of the access in number of days
        @param _proofOfIntegrigyDataAsset Hash of the DataAssetValue
        @param _proofOfSourceAuthenticity Address of the dataAssetProducerID, Etherum address
        @param _proofOfIntegrityUseProcessingConditions Hash of Use and Processing Conditions of the data Asset
     */
     function insertDataAsset(
                                address _dataAssetProducerID,
                                accessType _dataAssetAccessType,
                                string memory _dataAssetAccessPrice,
                                string memory _dataAssetAccessDuration,
                                bytes32 _proofOfIntegrigyDataAsset,
                                bytes32 _proofOfSourceAuthenticity,
                                bytes32 _proofOfIntegrityUseProcessingConditions) public{
            
                            }

    /** @dev Function in charge of inserting a Data Asset on SC
        @param _dataAssetID Hash of the dataAssetValue
        @return _dataAssetProducerID Address of the Data Producer
        @return _dataAssetAccessType :Type of access {free, paying}
        @return _dataAssetAccessPrice :Price in Ether set by the Data Producer to access the Data Asset, if paying one
        @return _dataAssetAccessDuration :Duration of the access in number of days
        @return _proofOfIntegrigyDataAsset :Hash of the DataAssetValue
        @return _proofOfSourceAuthenticity :Address of the dataAssetProducerID, Etherum address
        @return _proofOfIntegrityUseProcessingCondictions :Hash of Use and Processing Conditions of the data Asset
     */
    function getDataAsset(bytes32 _dataAssetID) public returns (address _dataAssetProducerID,
                                                                accessType _dataAssetAccessType,
                                                                string memory _dataAssetAccessPrice,
                                                                string memory _dataAssetAccessDuration,
                                                                bytes32 _proofOfIntegrigyDataAsset,
                                                                bytes32 _proofOfSourceAuthenticity,
                                                                bytes32 _proofOfIntegrityUseProcessingCondictions){
     /// generate eventGetDataAccess (address _dataAssetProducerID, address _dataAssetConsumerID, bytes32 _dataAssetID)                                                              
                                                                
                                                                }
    /** @dev Function in charge of geting the access type for a dataAssetID, so knowing if {free, paying}
        @param _dataAssetID Hash of the dataAssetValue a DataConsumer is trying to Access
        @return _dataAssetAccessType the type of access {free, paying} to access the Data Asset
    */
    function getDataAssetAccessType(bytes32 _dataAssetID) public returns (accessType _dataAssetAccessType){

    }
    /** @dev Function to give access to a Data Asset Consumer to a Data Asset. This function is called by the Data Asset Producer
        @param _dataAssetID Hash of the dataAssetValue for which the Data Producer wants to give an authorization
        @param _dataAssetConsumerID Address of the Dat Asset Consumer that could have the access (if free no access needed to be setup)
    */
    function insertDataAssetAccess(bytes32 _dataAssetID, address _dataAssetConsumerID) public {

    }
    /** @dev Function to be called by the Data Consumer, to pay for accessing the Data Asset if the Data Producer has specify paying access conditions
        @param _dataAssetID Hash of the dataAssetValue for which a user is going to pay for accessing it
    */
    function payToAccessDataAsset(bytes32 _dataAssetID) payable public{

    }

}