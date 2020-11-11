// SPDX-License-Identifier: EUPL V1.2
pragma solidity <=0.8.0;

/** @title ODTAValidator SC is in charge of managing DataAsset Trust Anchors
    @author Marc-Antoine Lemaire from Company IP Convergence
    @notice version 0.1, on 1 november 2020
 */
contract ODTAValidator { 
// ------------ Define the States Variables of the SC ----------------

// -- Objects used by Data Producer --
    address owner;
    /// dataProducerStore = mapping of dataProducerID Address to mapping of Hash Data Asset produced by him set to true to indicate produced
    mapping (address => mapping(bytes32 => bool)) public dataProducerStore;
    /// dataProdudcerDataAssetList = An array of dataAssetID produced by a dataProducerID
    /// !!! To Be Potentially suppress   bytes32[] public dataProducerDataAssetList;

// -- Objects used for managing Data Asset --
    /// dataAssetIDList = mapping of all the dataAssetID managed by the SC. It has value true if present
    /// !!! to check if needed because overlap with dataProducerStore[dataAssetProducerID][dataAsset]
    mapping (bytes32 => bool) public dataAssetIDList;
    /// accessType : enum saying if the access is free or you must pay
    enum accessType {free, paying}
    /// dataAssetObject = structure that containes all required Data Asset Information to manage Trust and access control from SC
    struct dataAssetObject{
        address dataAssetProducerID;
        accessType dataAssetAccessType; // Same access type for all, but we could in the future move that parameter to the dataAssetAccessObject
        uint256 dataAssetAccessPrice; // in wei (1 Ether = 1e18)
        string dataAssetAccessDuration; // in Number of days
        bytes32 proofOfIntegrigyDataAsset;
        bytes32 proofOfSourceAuthenticity;
        bytes32 proofOfIntegrityUseProcessingConditions;
    }
    /// dataAssetStore = mapping of all the dataAssetID (Hash of DataAsset) and their linked dataAssetObject
    mapping (bytes32 => dataAssetObject) public dataAssetStore;

// -- Objects used for managing Access to the Data Asset (only records for dataAssetAccessType = paying) --
    /// dataAssetAccessObject = structure that contains the access parameter for a Data Asset, only if paying resource
    struct dataAssetAccessObject{
        bool dataAssetAccessStatus;
        string dataAssetAccessStartDate;
        string dataAssetAccessEndDate;
    }
    /// dataAssetAccessStore = mapping of all the dataAssetID to the mapping of their dataConsumerID address to their dataAssetAccessObject
    /// ! if the dataAssetAccessType = Free, we don't created any entry on DataAssetAccessStore for the Data Asset
    mapping (bytes32 => mapping(address => dataAssetAccessObject)) public dataAssetAccessStore;

// -- Events needed to manage notification on operation on DataAsset --
    /// eventSetDataAccess = event to be generated every time a DataAssetProducerID give Access to a Data Asset to a Data Consumer
    event eventSetDataAccess(address _dataAssetProducerID, address _dataAssetConsumerID, bytes32 _dataAssetID);
     /// eventDeleteDataAccess = event to be generated every time a DataAssetProducerID removes the Access to a Data Asset to a Data Consumer
    event eventDeleteDataAccess(address _dataAssetProducerID, address _dataAssetConsumerID, bytes32 _dataAssetID);
    /// eventGetDataAccess = event to be generated every time a DataAssetConsumerID getAccess to a Data Asset
    event eventGetDataAccess(address indexed _dataAssetProducerID, address indexed _dataAssetConsumerID, bytes32 indexed _dataAssetID);
    /// eventRefuseDataAccess = event to be generated every time a DataAssetConsumerID has not yet access to a Data Asset because he has not yet paid the fee
    event eventRefuseDataAccess(address _dataAssetProducerID, address _dataAssetConsumerID, bytes32 _dataAssetID);
    /// eventDataAccessPaidSuccessfull = event to be generated every time a a Data Consumer paid successfully for the access to a paying Data Asset
    event eventDataAccessPaidSuccessfull(address _dataAssetProducerID, address _dataAssetConsumerID, bytes32 _dataAssetID, uint256 value);
    /// eventDataAccessPaidFailure = event to be generated every time a a Data Consumer payment failed for the access to a paying Data Asset
    event eventDataAccessPaidFailure(address _dataAssetProducerID, address _dataAssetConsumerID, bytes32 _dataAssetID, uint256 value);

// -- Modifier needed to perfom different control on some SC Data Asset --
    /// isOwner modifer: checks if the msg.sender is the owner of the contract
    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }
    /// isProducerOfExistingDataAsset: check if the msg.send is well the DataProducer of an existing DataAsset well present in dataProducerStore
    modifier isProducerOfExistingDataAsset(bytes32 _dataAssetID){
        require(dataProducerStore[msg.sender][_dataAssetID] == true);
        _;
    }
    /// isDataProducer: check if the msg.send is the same as Data Asset requested producer
    modifier isDataProducer(address _dataAssetProducerID){
        require(keccak256(abi.encodePacked(_dataAssetProducerID)) == keccak256(abi.encodePacked(msg.sender)));
        _;
    }
    /// isDataAssetExistInDataAssetIDList: check if a Data Asset is well presend in the DataAssetIDList
    modifier isDataAssetExistInDataAssetIDList(bytes32 _dataAssetID){
        require(dataAssetIDList[_dataAssetID]== true);
        _;
    }

// ------------ Define functions of the SC ----------------

    /** @dev Constructor of the ODTAValidator SmartContract
    */
    constructor() public{
        /* set the owner as the person who instantiated the contract. */
        owner = msg.sender;
    }

    /** @dev Function to enable account to send ether to this SmartContract via send, transfer or call
     */ 


    /** @dev Function in charge of inserting a Data Asset on SC
        @param _dataAssetID Hash of the Data Asset 
        @param _dataAssetProducerID Address of the dataAsset
        @param _dataAssetAccessType Type of access {free, paying}
        @param _dataAssetAccessPrice Price in Ether set by the Data Producer to access the Data Asset, if paying one
        @param _dataAssetAccessDuration Duration of the access in number of days
        @param _proofOfIntegrigyDataAsset Hash of the DataAssetValue
        @param _proofOfSourceAuthenticity Address of the dataAssetProducerID, Etherum address
        @param _proofOfIntegrityUseProcessingConditions Hash of Use and Processing Conditions of the data Asset
     */
     function insertDataAsset (
                                bytes32 _dataAssetID,
                                address _dataAssetProducerID,
                                string memory _dataAssetAccessType,
                                uint256 _dataAssetAccessPrice,
                                string memory _dataAssetAccessDuration,
                                bytes32 _proofOfIntegrigyDataAsset,
                                bytes32 _proofOfSourceAuthenticity,
                                bytes32 _proofOfIntegrityUseProcessingConditions) public isDataProducer(_dataAssetProducerID){
        if(dataProducerStore[_dataAssetProducerID][_dataAssetID] != true && _dataAssetProducerID == msg.sender){
            dataAssetIDList[_dataAssetID]=true;
            /// !!! could be overlap with dataAssetIDList (see what I choose)
            dataProducerStore[_dataAssetProducerID][_dataAssetID]=true;
            dataAssetStore[_dataAssetID].dataAssetProducerID=_dataAssetProducerID;
            if(keccak256(abi.encodePacked(_dataAssetAccessType)) == keccak256(abi.encodePacked("free"))){
                dataAssetStore[_dataAssetID].dataAssetAccessType=accessType.free;
            }
            if(keccak256(abi.encodePacked(_dataAssetAccessType)) == keccak256(abi.encodePacked("paying"))){
                dataAssetStore[_dataAssetID].dataAssetAccessType=accessType.paying;
                dataAssetAccessStore[_dataAssetID][_dataAssetProducerID].dataAssetAccessStatus=true;
                dataAssetAccessStore[_dataAssetID][_dataAssetProducerID].dataAssetAccessStartDate="ComingFeature";
                dataAssetAccessStore[_dataAssetID][_dataAssetProducerID].dataAssetAccessEndDate="ComingFeature";
                
            }
            dataAssetStore[_dataAssetID].dataAssetAccessPrice=_dataAssetAccessPrice;
            dataAssetStore[_dataAssetID].dataAssetAccessDuration=_dataAssetAccessDuration;
            dataAssetStore[_dataAssetID].proofOfIntegrigyDataAsset=_proofOfIntegrigyDataAsset;
            dataAssetStore[_dataAssetID].proofOfSourceAuthenticity=_proofOfSourceAuthenticity;
            dataAssetStore[_dataAssetID].proofOfIntegrityUseProcessingConditions=_proofOfIntegrityUseProcessingConditions;
        } /// !!! Add later on a try catch to give message is already in SC data
    }

    /** @dev Function in charge of inserting a Data Asset on SC
        @param _dataAssetID Hash of the dataAssetValue
        @return _dataAssetProducerID Address of the Data Producer
        @return _dataAssetAccessType :Type of access {free, paying}
        @return _dataAssetAccessPrice :Price in Ether set by the Data Producer to access the Data Asset, if paying one
        @return _dataAssetAccessDuration :Duration of the access in number of days
        @return _proofOfIntegrigyDataAsset :Hash of the DataAssetValue
        @return _proofOfSourceAuthenticity :Address of the dataAssetProducerID, Etherum address
        @return _proofOfIntegrityUseProcessingConditions :Hash of Use and Processing Conditions of the data Asset
     */
    function getDataAsset(bytes32 _dataAssetID) public view returns (address _dataAssetProducerID,
                                                                string memory _dataAssetAccessType,
                                                                uint256 _dataAssetAccessPrice,
                                                                string memory _dataAssetAccessDuration,
                                                                bytes32 _proofOfIntegrigyDataAsset,
                                                                bytes32 _proofOfSourceAuthenticity,
                                                                bytes32 _proofOfIntegrityUseProcessingConditions){
      if(dataAssetIDList[_dataAssetID]==true){
            if(dataAssetStore[_dataAssetID].dataAssetAccessType == accessType.free){
                _dataAssetAccessType="free"; //
                _dataAssetProducerID=dataAssetStore[_dataAssetID].dataAssetProducerID;
                _dataAssetAccessPrice=dataAssetStore[_dataAssetID].dataAssetAccessPrice;
                _dataAssetAccessDuration=dataAssetStore[_dataAssetID].dataAssetAccessDuration;
                _proofOfIntegrigyDataAsset=dataAssetStore[_dataAssetID].proofOfIntegrigyDataAsset;
                _proofOfSourceAuthenticity=dataAssetStore[_dataAssetID].proofOfSourceAuthenticity;
                _proofOfIntegrityUseProcessingConditions=dataAssetStore[_dataAssetID].proofOfIntegrityUseProcessingConditions;
                //emit eventGetDataAccess(_dataAssetProducerID,msg.sender,_dataAssetID);
            }
            if(dataAssetStore[_dataAssetID].dataAssetAccessType == accessType.paying && dataAssetAccessStore[_dataAssetID][msg.sender].dataAssetAccessStatus==true){
                _dataAssetAccessType="paying";
                _dataAssetProducerID=dataAssetStore[_dataAssetID].dataAssetProducerID;
                _dataAssetAccessPrice=dataAssetStore[_dataAssetID].dataAssetAccessPrice;
                _dataAssetAccessDuration=dataAssetStore[_dataAssetID].dataAssetAccessDuration;
                _proofOfIntegrigyDataAsset=dataAssetStore[_dataAssetID].proofOfIntegrigyDataAsset;
                _proofOfSourceAuthenticity=dataAssetStore[_dataAssetID].proofOfSourceAuthenticity;
                _proofOfIntegrityUseProcessingConditions=dataAssetStore[_dataAssetID].proofOfIntegrityUseProcessingConditions;
                //emit eventGetDataAccess(_dataAssetProducerID,msg.sender,_dataAssetID);
            }
            if(dataAssetStore[_dataAssetID].dataAssetAccessType == accessType.paying && dataAssetAccessStore[_dataAssetID][msg.sender].dataAssetAccessStatus!=true){
                _dataAssetAccessType="paying";
                _dataAssetProducerID=dataAssetStore[_dataAssetID].dataAssetProducerID;
                _dataAssetAccessPrice=dataAssetStore[_dataAssetID].dataAssetAccessPrice;
                _dataAssetAccessDuration=dataAssetStore[_dataAssetID].dataAssetAccessDuration;
                _proofOfIntegrigyDataAsset="refused";
                _proofOfSourceAuthenticity="refused";
                _proofOfIntegrityUseProcessingConditions="refused";
                //emit eventRefuseDataAccess(_dataAssetProducerID,msg.sender,_dataAssetID);
            }                                                           
        }
    }
    /** @dev Function in charge of geting the access type for a dataAssetID, so knowing if {free, paying}
        @param _dataAssetID Hash of the dataAssetValue a DataConsumer is trying to Access
        @return _dataAssetAccessType the type of access {free, paying} to access the Data Asset
    */
    function getDataAssetAccessType(bytes32 _dataAssetID) public view returns (string memory _dataAssetAccessType){
        if(dataAssetIDList[_dataAssetID]==true){
            if(dataAssetStore[_dataAssetID].dataAssetAccessType == accessType.free){
                _dataAssetAccessType="free";
            }
            if(dataAssetStore[_dataAssetID].dataAssetAccessType == accessType.paying){
               _dataAssetAccessType="paying";
            }
        } /// Add trow error is dataAssetID is not in dataAssetStore
    }
    /** @dev Function to give access to a Data Asset Consumer to a Data Asset. This function is called by the Data Asset Producer
        @param _dataAssetID Hash of the dataAssetValue for which the Data Producer wants to give an authorization
        @param _dataAssetConsumerID Address of the Dat Asset Consumer that could have the access (if free no access needed to be setup)
    */
    /// !!! Not sure I need this because it is automatically authorized inside the function payToAccessDataAsset
    function setDataAssetAccess(bytes32 _dataAssetID, address _dataAssetConsumerID,bool _access) public isProducerOfExistingDataAsset(_dataAssetID){
        dataAssetAccessStore[_dataAssetID][_dataAssetConsumerID].dataAssetAccessStatus=_access;
        dataAssetAccessStore[_dataAssetID][_dataAssetConsumerID].dataAssetAccessStartDate="ComingFeature";
        dataAssetAccessStore[_dataAssetID][_dataAssetConsumerID].dataAssetAccessEndDate="ComingFeature";
        /// event emitted to notify the _dataAssetConsumerID he has well received access to the Data Asset, following his succefull money transaction
        if(_access == true){
            emit eventSetDataAccess(msg.sender, _dataAssetConsumerID, _dataAssetID);
        }
        if(_access==false){
            emit eventDeleteDataAccess(msg.sender, _dataAssetConsumerID, _dataAssetID);
        }
        
    }
    /** @dev Function in charge of geting the access type for a dataAssetID, so knowing if {free, paying}
        @param _dataAssetID Hash of the dataAssetValue a DataConsumer is trying to Access
        @param _dataAssetConsumerID Address of the consumer we want to know if he has received the access from the Data Producer
        @return _access Boolean indicating if the dataAssetConsumerID has access to the _dataAssetID
    */
    function getDataAssetAccess(bytes32 _dataAssetID, address _dataAssetConsumerID) public view returns (bool _access){
        if(dataAssetIDList[_dataAssetID]==true){
           if(dataAssetStore[_dataAssetID].dataAssetAccessType == accessType.free){
                return true;
            }
            if(dataAssetStore[_dataAssetID].dataAssetAccessType == accessType.paying){
                return dataAssetAccessStore[_dataAssetID][_dataAssetConsumerID].dataAssetAccessStatus;
            } 
           
        } /// Add trow error is dataAssetID is not in dataAssetStore
    }
    /** @dev Function to be called by the Data Consumer, to pay for accessing the Data Asset if the Data Producer has specify paying access conditions
        @param _dataAssetID Hash of the dataAssetValue for which a user is going to pay for accessing it
        @param _toDestination Address of the Data Producer of the Asset that should receive the money paid by the consumer
    */
    /// ! Not Implemented for the Project Course
    function payToAccessDataAsset(bytes32 _dataAssetID, address payable _toDestination) public payable isDataAssetExistInDataAssetIDList(_dataAssetID){
        if(dataAssetAccessStore[_dataAssetID][msg.sender].dataAssetAccessStatus!=true && dataAssetStore[_dataAssetID].dataAssetProducerID ==_toDestination){
            require(msg.value >= dataAssetStore[_dataAssetID].dataAssetAccessPrice, "Insufficient funds"); // !!! msg.value is in WEI Unit (1 Ether = 1e18 wei)
            /// Autorization is set to the msg.sender for the Data Asset
            dataAssetAccessStore[_dataAssetID][msg.sender].dataAssetAccessStatus=true; // Prevent Reentrancy Issue
            dataAssetAccessStore[_dataAssetID][msg.sender].dataAssetAccessStartDate="ComingFeature";
            dataAssetAccessStore[_dataAssetID][msg.sender].dataAssetAccessEndDate="ComingFeature";
            emit eventSetDataAccess(_toDestination, msg.sender, _dataAssetID);
            emit eventDataAccessPaidSuccessfull(dataAssetStore[_dataAssetID].dataAssetProducerID, msg.sender, _dataAssetID, dataAssetStore[_dataAssetID].dataAssetAccessPrice);
            _toDestination.transfer(msg.value); // Prevent Reentrancy Issue, by puting the call to extenal function at the end
        } /// !!! To be optimized later on v2.0 because not secure optimal for money transert
    }
    

}




