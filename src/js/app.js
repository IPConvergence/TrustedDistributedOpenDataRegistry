App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load dataAssets.
    $.getJSON('../dataAssets.json', function(data) {
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
      //return App.markAccessed();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-publish', App.handlePublish);
  },

  markAccessed: function() {
    var ODTAValidatorInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.ODTAValidator.deployed().then(function(instance) {
        ODTAValidatorInstance = instance;

        // Execute adopt as a transaction by sending account
        //return ODTAValidatorInstance.adopt(petId, {from: account});
        return ODTAValidatorInstance.getDataAsset("0x1ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc",{from: account});
      }).then(function(dataAsset) {
            $('.panel-dataAsset').eq(0).find('.data-dataAssetAccessType').text(dataAsset[1]);;
      }).catch(function(err) {
        console.log(err.message);
      });
    });
   /**  App.contracts.ODTAValidator.deployed().then(function(instance) {
      ODTAValidatorInstance = instance;
      return ODTAValidatorInstance.getDataAsset("0x1ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc", "0xe91058129CaaBcE0A10113e6b28B949a5A4e8500").call();
      }).then(function(dataAsset) {
          //for (i = 0; i < dataAsset.length; i++) {
            console.log(dataAsset[1])
            if (dataAsset[1] == "paying") {
              $('.panel-dataAsset').eq(1).find('.data-dataAssetAccessType').text("AccessGranted");;
            }
         // }
      }).catch(function(err) {
        console.log(err.message);
      }); */
  },

  handlePublish: function(event) {
    event.preventDefault();
   // var dataAssetId = parseInt($(event.target).data('id'));

    var ODTAValidatorInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.ODTAValidator.deployed().then(function(instance) {
        ODTAValidatorInstance = instance;

        // Execute adopt as a transaction by sending account
        //return ODTAValidatorInstance.adopt(petId, {from: account});
        return ODTAValidatorInstance.insertDataAsset("0x1ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc", "0xe91058129CaaBcE0A10113e6b28B949a5A4e8500","paying","100000000000000000","na","0x1abccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc","0x1abccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc","0x1abccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc", {from: account});
      }).then(function(result) {
        //return App.markAccessed();
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
