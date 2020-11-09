App = {
  web3Provider: null,
  contracts: {},
  sourceDataAsset:null,

  init: async function() {
    // Load dataAssets.
    $.getJSON('../dataAssets.json', function(data) {
      App.sourceDataAsset=data;
      var dataAssetsRow = $('#dataAssetsRow');
      var dataAssetTemplate = $('#dataAssetTemplate');

      for (i = 0; i < data.length; i ++) {
        dataAssetTemplate.find('.panel-title').text(data[i].name);
        dataAssetTemplate.find('img').attr('src', data[i].picture);
       // dataAssetTemplate.find('.data-dataAssetID').text(data[i].dataAssetID);
        dataAssetTemplate.find('.data-dataAssetAccessType').text(data[i].dataAssetAccessType);
       // dataAssetTemplate.find('.data-dataAssetProducerID').text(data[i].dataAssetProducerID);
        dataAssetTemplate.find('.data-dataAsset-sensorID').text(data[i].dataAssetValue.sensorID);
        dataAssetTemplate.find('.data-dataAsset-sensorLocation').text(data[i].dataAssetValue.sensorLocation);
        //dataAssetTemplate.find('.data-dataAsset-dataAssetProducerID').text(data[i].dataAssetProducerID);
        dataAssetTemplate.find('.btn-publish').attr('data-id', data[i].id);
        dataAssetTemplate.find('.btn-setAccess').attr('data-id', data[i].id);
        dataAssetTemplate.find('.btn-getAccess').attr('data-id', data[i].id);
        dataAssetsRow.append(dataAssetTemplate.html());
      }
    });
    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('../ODTAValidator.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var ODTAValidatorArtifact = data;
      App.contracts.ODTAValidator = TruffleContract(ODTAValidatorArtifact);
    
      // Set the provider for our contract
      App.contracts.ODTAValidator.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the published Data Asset
     return App.markAccessed();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-publish', App.handlePublish);
    $(document).on('click', '.btn-setAccess', App.handleSetAccess);
    //$(document).on('click', '.btn-payAccess', App.handlePayAccess);
  },

  markAccessed:  async function() {
    let instance = await App.contracts.ODTAValidator.deployed();
    var address = web3.eth.accounts[0];
    for (i =0; i<4; i ++){
      let output = await instance.getDataAssetAccess(App.sourceDataAsset[i].dataAssetID, address,{from:address});
      let output2= await instance.getDataAsset(App.sourceDataAsset[i].dataAssetID,{from:address});
      let output3= await instance.getDataAssetAccessType(App.sourceDataAsset[i].dataAssetID,{from:address});
      // check that the consumer address calling ledger has access to asset and display info from ledger
      if(output == true){
        $('.panel-dataAsset').eq(i).find('.data-dataAssetAccessAuthorization').text(output);
        $('.panel-dataAsset').eq(i).find('.data-dataAssetDestination').text(address);
      }
      // if asset is in the ledger, we display the published status and we take the Publisher From the Data Asset anchored on ledger and not from address calling
      if(output3 == "free" || output3 == "paying"){
        $('.panel-dataAsset').eq(i).find('.data-dataAssetPublicationStatus').text("Published");
        $('.panel-dataAsset').eq(i).find('.data-dataAsset-dataAssetProducerID').text(output2[0]);
      }
    }
  },

  handlePublish: function(event) {
    event.preventDefault();
    var dataId = parseInt($(event.target).data('id'));
    var ODTAValidatorInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.ODTAValidator.deployed().then(function(instance) {
        ODTAValidatorInstance = instance;
        // Execute inserDataAsset as a transaction by sending account
        //return ODTAValidatorInstance.adopt(petId, {from: account});
        return ODTAValidatorInstance.insertDataAsset(App.sourceDataAsset[dataId].dataAssetID, App.sourceDataAsset[dataId].dataAssetProducerID,App.sourceDataAsset[dataId].dataAssetAccessType,App.sourceDataAsset[dataId].dataAssetAccessPrice,"FeatureNotYetAvailable",App.sourceDataAsset[dataId].proofOfIntegrigyDataAsset,App.sourceDataAsset[dataId].proofOfSourceAuthenticity,App.sourceDataAsset[dataId].proofOfIntegrityUseProcessingConditions, {from: account});
      }).then(function(result) {
        // If operation succeed, then update WebPage that Data has been inserted
        return App.markAccessed();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  //!!! Set here a box where we can put the Address that we give the access to
  handleSetAccess: function(event) {
    event.preventDefault();
    var dataId = parseInt($(event.target).data('id'));
    var ODTAValidatorInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.ODTAValidator.deployed().then(function(instance) {
        ODTAValidatorInstance = instance;
        // Execute inserDataAsset as a transaction by sending account
        //return ODTAValidatorInstance.adopt(petId, {from: account});
        return ODTAValidatorInstance.setDataAssetAccess(App.sourceDataAsset[dataId].dataAssetID, "0xe71890eb0Bbaf7eA0A5F68f1145E378d3b17DC8D",true);
      }).then(function(result) {
        // If operation succeed, then update WebPage that Data has been inserted
        return App.markAccessed();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  // Not Yet Opperational for version 1.0
  handlePayAccess: function(event) {
    event.preventDefault();
    var dataId = parseInt($(event.target).data('id'));
    var ODTAValidatorInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contracts.ODTAValidator.deployed().then(function(instance) {
        ODTAValidatorInstance = instance;
        // Execute inserDataAsset as a transaction by sending account
        //return ODTAValidatorInstance.adopt(petId, {from: account});
        return ODTAValidatorInstance.payToAccessDataAsset(App.sourceDataAsset[dataId].dataAssetID, "0x564CEBc766727DFFBae31356dc78365e9113030A");
      }).then(function(result) {
        // If operation succeed, then update WebPage that Data has been inserted
        return App.markAccessed();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
  

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
