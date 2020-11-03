/** @title Test_ODTAValidator javascript is test script for validating the good working of the DataAsset Trust Anchors
    @author Marc-Antoine Lemaire from Company IP Convergence
    @notice version 0.1, on 3 november 2020
 */

let ODTAValidator = artifacts.require('ODTAValidator')

contract('ODTAValidator', function(accounts) {

    const owner = accounts[0]
    const dataAssetProducerID = accounts[1]
    const dataAssetConsumerID1 = accounts[2]
    const dataAssetConsumerID2 = accounts[3]
    const dataAssetID = "0x7ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"
    const dataAssetAccessType1 = "paying"
    const dataAssetAccessType2 = "free"
    const dataAssetAccessPrice = "100000000000000000" //in Wei unit, here is 0,1 Eth Cost (1eth = 1e18), feature not yet implemented in v0.1 version of ODTAValidator
    const dataAssetAccessDuration = "not yet Available"
    const proofOfIntegrigyDataAsset = "0x9abccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc" // Bytes 32 format of hash
    const proofOfSourceAuthenticity = "0x9abccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc" // Bytes 32 format of hash
    const proofOfIntegrityUseProcessingConditions = "0x9abccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc" // Bytes 32 format of hash
    
    let instance

    beforeEach(async () => {
        instance = await ODTAValidator.new()
    })
       
    it("Step 1: A Data Asset Provider adds a new paying Data Asset into the ODTA Registry and read it", async() => {
        const tx1 = await instance.insertDataAsset(dataAssetID, dataAssetProducerID,dataAssetAccessType1,dataAssetAccessPrice,dataAssetAccessDuration,proofOfIntegrigyDataAsset,proofOfSourceAuthenticity,proofOfIntegrityUseProcessingConditions, {from: dataAssetProducerID})
        const result = await instance.getDataAsset(dataAssetID, {from: dataAssetProducerID})
        const result2 = await instance.getDataAssetAccess(dataAssetID,dataAssetProducerID, {from: dataAssetProducerID})
        assert.equal(result[0], dataAssetProducerID, 'The dataProducerID inserted in SC does not match the expected value')
        assert.equal(result[1], dataAssetAccessType1, 'The dataAssetAccessType inserted in SC does not match the expected value')
        assert.equal(result2, true, 'The dataAssetAccess inserted in SC does not match the expected value')
        assert.equal(result[2].toString(10),dataAssetAccessPrice , 'The dataAssetAccessPrice inserted in SC does not match the expected value')
        assert.equal(result[3], dataAssetAccessDuration, 'The dataAssetAccessDuration inserted in SC does not match the expected value')
        assert.equal(result[4], proofOfIntegrigyDataAsset, 'The proofOfIntegrigyDataAsset inserted in SC does not match the expected value')
        assert.equal(result[5], proofOfSourceAuthenticity, 'The proofOfSourceAuthenticity inserted in SC does not match the expected value')
        assert.equal(result[6], proofOfIntegrityUseProcessingConditions, 'The proofOfIntegrityUseProcessingConditions inserted in SC does not match the expected value')
        console.log(`
            "Output Step 1: A Data Asset Provider adds a new paying Data Asset into the ODTA Registry and read it" 
                "dataAssetID:"                              ${dataAssetID}
                "dataProducerID:"                           ${result[0]}
                "dataConsumerID:"                           ${dataAssetProducerID}
                "dataAssetAccessType:"                      ${result[1]}
                "dataAssetAccess:"                          ${result2}
                "dataAssetAccessPrice:"                     ${result[2]} 
                "dataAssetAccessDuration":                  ${result[3]} 
                "proofOfIntegrigyDataAsset:"                ${result[4]} 
                "proofOfSourceAuthenticity:"                ${result[5]} 
                "proofOfIntegrityUseProcessingConditions:"  ${result[6]} `)
    })
    
    /// "0x7265667573656400000000000000000000000000000000000000000000000000" means refused in Hexadecimal
    it("Step 2: A Data Asset Consumer tries accessing a new paying Data Asset into the ODTA Registry and read it, without having full access right", async() => {
        const tx2 = await instance.insertDataAsset(dataAssetID, dataAssetProducerID,dataAssetAccessType1,dataAssetAccessPrice,dataAssetAccessDuration,proofOfIntegrigyDataAsset,proofOfSourceAuthenticity,proofOfIntegrityUseProcessingConditions, {from: dataAssetProducerID})
        const result1 = await instance.getDataAsset(dataAssetID, {from: dataAssetConsumerID1})
        const result2 = await instance.getDataAssetAccess(dataAssetID,dataAssetConsumerID1, {from: dataAssetConsumerID1})
        assert.equal(result1[0], dataAssetProducerID, 'The dataProducerID inserted in SC does not match the expected value')
        assert.equal(result1[1], dataAssetAccessType1, 'The dataAssetAccessType inserted in SC does not match the expected value')
        assert.equal(result2, false, 'The dataAssetAccess inserted in SC does not match the expected value')
        assert.equal(result1[2].toString(10),dataAssetAccessPrice , 'The dataAssetAccessPrice inserted in SC does not match the expected value')
        assert.equal(result1[3], dataAssetAccessDuration, 'The dataAssetAccessDuration inserted in SC does not match the expected value')
        assert.equal(result1[4], "0x7265667573656400000000000000000000000000000000000000000000000000", 'The proofOfIntegrigyDataAsset inserted in SC does not match the expected value')
        assert.equal(result1[5], "0x7265667573656400000000000000000000000000000000000000000000000000", 'The proofOfSourceAuthenticity inserted in SC does not match the expected value')
        assert.equal(result1[6], "0x7265667573656400000000000000000000000000000000000000000000000000", 'The proofOfIntegrityUseProcessingConditions inserted in SC does not match the expected value')
        console.log(`
            "Output Step 2: A Data Asset Consumer tries accessing a new paying Data Asset into the ODTA Registry and read it, without having full access right" 
                "dataAssetID:"                              ${dataAssetID}
                "dataProducerID:"                           ${result1[0]}
                "dataConsumerID:"                           ${dataAssetConsumerID1}
                "dataAssetAccessType:"                      ${result1[1]}
                "dataAssetAccess:"                          ${result2} 
                "dataAssetAccessPrice:"                     ${result1[2]} 
                "dataAssetAccessDuration":                  ${result1[3]} 
                "proofOfIntegrigyDataAsset:"                ${result1[4]} "means refused in Hexadecimal"
                "proofOfSourceAuthenticity:"                ${result1[5]} "means refused in Hexadecimal"
                "proofOfIntegrityUseProcessingConditions:"  ${result1[6]} "means refused in Hexadecimal"`)
    })
    it("Step 3: A Data Asset Producer gives access to a Data Consumer to the paying Data Asset into the ODTA Registry", async() => {
        const tx2 = await instance.insertDataAsset(dataAssetID, dataAssetProducerID,dataAssetAccessType1,dataAssetAccessPrice,dataAssetAccessDuration,proofOfIntegrigyDataAsset,proofOfSourceAuthenticity,proofOfIntegrityUseProcessingConditions, {from: dataAssetProducerID})
        const tx3 = await instance.setDataAssetAccess(dataAssetID, dataAssetConsumerID1,true, {from: dataAssetProducerID})
        const result3 = await instance.getDataAsset(dataAssetID, {from: dataAssetConsumerID1})
        const result4 = await instance.getDataAssetAccess(dataAssetID,dataAssetConsumerID1, {from: dataAssetConsumerID1})
        assert.equal(result3[0], dataAssetProducerID, 'The dataProducerID inserted in SC does not match the expected value')
        assert.equal(result3[1], dataAssetAccessType1, 'The dataAssetAccessType inserted in SC does not match the expected value')
        assert.equal(result4, true, 'The dataAssetAccess inserted in SC does not match the expected value')
        assert.equal(result3[2].toString(10),dataAssetAccessPrice , 'The dataAssetAccessPrice inserted in SC does not match the expected value')
        assert.equal(result3[3], dataAssetAccessDuration, 'The dataAssetAccessDuration inserted in SC does not match the expected value')
        assert.equal(result3[4], proofOfIntegrigyDataAsset, 'The proofOfIntegrigyDataAsset inserted in SC does not match the expected value')
        assert.equal(result3[5], proofOfSourceAuthenticity, 'The proofOfSourceAuthenticity inserted in SC does not match the expected value')
        assert.equal(result3[6], proofOfIntegrityUseProcessingConditions, 'The proofOfIntegrityUseProcessingConditions inserted in SC does not match the expected value')
        console.log(`
            "Output Step 3: A Data Asset Producer gives access to a Data Consumer to the paying Data Asset into the ODTA Registry" 
                "dataAssetID:"                              ${dataAssetID}
                "dataProducerID:"                           ${result3[0]}
                "dataConsumerID:"                           ${dataAssetConsumerID1}
                "dataAssetAccessType:"                      ${result3[1]} 
                "dataAssetAccess:"                          ${result4}
                "dataAssetAccessPrice:"                     ${result3[2]} 
                "dataAssetAccessDuration":                  ${result3[3]} 
                "proofOfIntegrigyDataAsset:"                ${result3[4]} 
                "proofOfSourceAuthenticity:"                ${result3[5]} 
                "proofOfIntegrityUseProcessingConditions:"  ${result3[6]} `)
    })
    it("Step 4: A Data Asset Producer gives access to a Data Consumer1 to the paying Data Asset into the ODTA Registry, Data Consumer2 tries accessing it", async() => {
        const tx2 = await instance.insertDataAsset(dataAssetID, dataAssetProducerID,dataAssetAccessType1,dataAssetAccessPrice,dataAssetAccessDuration,proofOfIntegrigyDataAsset,proofOfSourceAuthenticity,proofOfIntegrityUseProcessingConditions, {from: dataAssetProducerID})
        const tx3 = await instance.setDataAssetAccess(dataAssetID, dataAssetConsumerID1,true, {from: dataAssetProducerID})
        const result4 = await instance.getDataAsset(dataAssetID, {from: dataAssetConsumerID2})
        const result5 = await instance.getDataAssetAccess(dataAssetID,dataAssetConsumerID2, {from: dataAssetConsumerID1})
        assert.equal(result4[0], dataAssetProducerID, 'The dataProducerID inserted in SC does not match the expected value')
        assert.equal(result4[1], dataAssetAccessType1, 'The dataAssetAccessType inserted in SC does not match the expected value')
        assert.equal(result5, false, 'The dataAssetAccess inserted in SC does not match the expected value')
        assert.equal(result4[2].toString(10),dataAssetAccessPrice , 'The dataAssetAccessPrice inserted in SC does not match the expected value')
        assert.equal(result4[3], dataAssetAccessDuration, 'The dataAssetAccessDuration inserted in SC does not match the expected value')
        assert.equal(result4[4], "0x7265667573656400000000000000000000000000000000000000000000000000", 'The proofOfIntegrigyDataAsset inserted in SC does not match the expected value')
        assert.equal(result4[5], "0x7265667573656400000000000000000000000000000000000000000000000000", 'The proofOfSourceAuthenticity inserted in SC does not match the expected value')
        assert.equal(result4[6], "0x7265667573656400000000000000000000000000000000000000000000000000", 'The proofOfIntegrityUseProcessingConditions inserted in SC does not match the expected value')
        console.log(`
            "Output Step 4: A Data Asset Producer gives access to a Data Consumer1 to the paying Data Asset into the ODTA Registry, Data Consumer2 tries accessing it" 
                "dataAssetID:"                              ${dataAssetID}
                "dataProducerID:"                           ${result4[0]}
                "dataConsumerID:"                           ${dataAssetConsumerID2}
                "dataAssetAccessType:"                      ${result4[1]} 
                "dataAssetAccess:"                          ${result5}
                "dataAssetAccessPrice:"                     ${result4[2]} 
                "dataAssetAccessDuration":                  ${result4[3]} 
                "proofOfIntegrigyDataAsset:"                ${result4[4]} "means refused in Hexadecimal"
                "proofOfSourceAuthenticity:"                ${result4[5]} "means refused in Hexadecimal"
                "proofOfIntegrityUseProcessingConditions:"  ${result4[6]} "means refused in Hexadecimal"`)
    })
    it("Step 5: A Data Asset Producer gives access to a Data Consumer1 to the paying Data Asset into the ODTA Registry, then remove him that access rigth", async() => {
        const tx2 = await instance.insertDataAsset(dataAssetID, dataAssetProducerID,dataAssetAccessType1,dataAssetAccessPrice,dataAssetAccessDuration,proofOfIntegrigyDataAsset,proofOfSourceAuthenticity,proofOfIntegrityUseProcessingConditions, {from: dataAssetProducerID})
        const tx3 = await instance.setDataAssetAccess(dataAssetID, dataAssetConsumerID1,true, {from: dataAssetProducerID})
        const tx4 = await instance.setDataAssetAccess(dataAssetID, dataAssetConsumerID1,false, {from: dataAssetProducerID})
        const result3 = await instance.getDataAsset(dataAssetID, {from: dataAssetConsumerID1})
        const result4 = await instance.getDataAssetAccess(dataAssetID,dataAssetConsumerID1, {from: dataAssetConsumerID1})
        assert.equal(result3[0], dataAssetProducerID, 'The dataProducerID inserted in SC does not match the expected value')
        assert.equal(result3[1], dataAssetAccessType1, 'The dataAssetAccessType inserted in SC does not match the expected value')
        assert.equal(result4, false, 'The dataAssetAccess inserted in SC does not match the expected value')
        assert.equal(result3[2].toString(10),dataAssetAccessPrice , 'The dataAssetAccessPrice inserted in SC does not match the expected value')
        assert.equal(result3[3], dataAssetAccessDuration, 'The dataAssetAccessDuration inserted in SC does not match the expected value')
        assert.equal(result3[4], "0x7265667573656400000000000000000000000000000000000000000000000000", 'The proofOfIntegrigyDataAsset inserted in SC does not match the expected value')
        assert.equal(result3[5], "0x7265667573656400000000000000000000000000000000000000000000000000", 'The proofOfSourceAuthenticity inserted in SC does not match the expected value')
        assert.equal(result3[6], "0x7265667573656400000000000000000000000000000000000000000000000000", 'The proofOfIntegrityUseProcessingConditions inserted in SC does not match the expected value')
        console.log(`
            "Output Step 5: A Data Asset Producer gives access to a Data Consumer1 to the paying Data Asset into the ODTA Registry, then remove him that access rigth" 
                "dataAssetID:"                              ${dataAssetID}
                "dataProducerID:"                           ${result3[0]}
                "dataConsumerID:"                           ${dataAssetConsumerID1}
                "dataAssetAccessType:"                      ${result3[1]} 
                "dataAssetAccess:"                          ${result4}
                "dataAssetAccessPrice:"                     ${result3[2]} 
                "dataAssetAccessDuration":                  ${result3[3]} 
                "proofOfIntegrigyDataAsset:"                ${result3[4]} "means refused in Hexadecimal"
                "proofOfSourceAuthenticity:"                ${result3[5]} "means refused in Hexadecimal"
                "proofOfIntegrityUseProcessingConditions:"  ${result3[6]} "means refused in Hexadecimal"`)
    })
    it("Step 6: A Data Asset Provider adds a new free Data Asset into the ODTA Registry. Every user can read it without needing any access", async() => {
        const tx2 = await instance.insertDataAsset(dataAssetID, dataAssetProducerID,dataAssetAccessType2,dataAssetAccessPrice,dataAssetAccessDuration,proofOfIntegrigyDataAsset,proofOfSourceAuthenticity,proofOfIntegrityUseProcessingConditions, {from: dataAssetProducerID})
        const result = await instance.getDataAsset(dataAssetID, {from: dataAssetConsumerID2})
        const result2 = await instance.getDataAssetAccess(dataAssetID,dataAssetConsumerID2, {from: dataAssetConsumerID1})
        assert.equal(result[0], dataAssetProducerID, 'The dataProducerID inserted in SC does not match the expected value')
        assert.equal(result[1], dataAssetAccessType2, 'The dataAssetAccessType inserted in SC does not match the expected value')
        assert.equal(result2, true, 'The dataAssetAccess inserted in SC does not match the expected value')
        assert.equal(result[2].toString(10),dataAssetAccessPrice , 'The dataAssetAccessPrice inserted in SC does not match the expected value')
        assert.equal(result[3], dataAssetAccessDuration, 'The dataAssetAccessDuration inserted in SC does not match the expected value')
        assert.equal(result[4], proofOfIntegrigyDataAsset, 'The proofOfIntegrigyDataAsset inserted in SC does not match the expected value')
        assert.equal(result[5], proofOfSourceAuthenticity, 'The proofOfSourceAuthenticity inserted in SC does not match the expected value')
        assert.equal(result[6], proofOfIntegrityUseProcessingConditions, 'The proofOfIntegrityUseProcessingConditions inserted in SC does not match the expected value')
        console.log(`
            "Output Step 6: A Data Asset Provider adds a new free Data Asset into the ODTA Registry. Every user can read it without needing any access" 
                "dataAssetID:"                              ${dataAssetID}
                "dataProducerID:"                           ${result[0]}
                "dataConsumerID:"                           ${dataAssetConsumerID2}
                "dataAssetAccessType:"                      ${result[1]} 
                "dataAssetAccess:"                          ${result2}
                "dataAssetAccessPrice:"                     ${result[2]} 
                "dataAssetAccessDuration":                  ${result[3]} 
                "proofOfIntegrigyDataAsset:"                ${result[4]} 
                "proofOfSourceAuthenticity:"                ${result[5]} 
                "proofOfIntegrityUseProcessingConditions:"  ${result[6]} `)
    })
})
