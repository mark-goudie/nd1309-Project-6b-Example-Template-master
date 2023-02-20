// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", function(accounts) {
  // Declare few constants and assign a few sample accounts generated by ganache-cli
  var sku = 1;
  var upc = 1;
  const ownerID = accounts[0];
  const originFarmerID = accounts[1];
  const originFarmName = "John Doe";
  const originFarmInformation = "Yarray Valley";
  const originFarmLatitude = "-38.239770";
  const originFarmLongitude = "144.341490";
  var productID = sku + upc;
  const productNotes = "Best beans for Espresso";
  const productPrice = web3.toWei(1, "ether");
  var itemState = 0;
  const distributorID = accounts[2];
  const retailerID = accounts[3];
  const consumerID = accounts[4];
  const emptyAddress = "0x00000000000000000000000000000000000000";

  ///Available Accounts
  ///==================
  ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
  ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
  ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
  ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
  ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
  ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
  ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
  ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
  ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
  ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

  console.log("ganache-cli accounts used here...");
  console.log("Contract Owner: accounts[0] ", accounts[0]);
  console.log("Farmer: accounts[1] ", accounts[1]);
  console.log("Distributor: accounts[2] ", accounts[2]);
  console.log("Retailer: accounts[3] ", accounts[3]);
  console.log("Consumer: accounts[4] ", accounts[4]);

  // 1st Test
  it("Testing smart contract function harvestItem() that allows a farmer to harvest coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    var eventEmitted = false;

    // Watch the emitted event Harvested()
    var event = supplyChain.Harvested();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as Harvested by calling function harvestItem()
    await supplyChain.harvestItem(
      upc,
      originFarmerID,
      originFarmName,
      originFarmInformation,
      originFarmLatitude,
      originFarmLongitude,
      productNotes
    );

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(resultBufferTwo[5], 0, "Error: Invalid item State");
    assert.equal(eventEmitted, true, "Invalid event emitted");
  });

  // 2nd Test
  it("Testing smart contract function processItem() that allows a farmer to process coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    var eventEmitted = false;

    // Watch the emitted event Processed()
    var event = supplyChain.Processed();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as Processed by calling function processItem()
    await supplyChain.processItem(upc, { from: originFarmerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(resultBufferTwo[5], 1, "Error: Invalid item State");
    assert.equal(eventEmitted, true, "Invalid event emitted");
  });

  // 3rd Test
  it("Testing smart contract function packItem() that allows a farmer to pack coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    var eventEmitted = false;

    // Watch the emitted event Packed()
    var event = supplyChain.Packed();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as Packed by calling function packItem()
    await supplyChain.packItem(upc, { from: originFarmerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(resultBufferTwo[5], 2, "Error: Invalid item State");
    assert.equal(eventEmitted, true, "Invalid event emitted");
  });

  // 4th Test
  it("Testing smart contract function sellItem() that allows a farmer to sell coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    var eventEmitted = false;

    // Watch the emitted event ForSale()
    var event = supplyChain.ForSale();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as ForSale by calling function sellItem()
    await supplyChain.sellItem(upc, productPrice, { from: originFarmerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferTwo[5], 1, "Error: Invalid item State");
    assert.equal(resultBufferTwo[4], productPrice, "Error: Invalid item Price");
    assert.equal(eventEmitted, true, "Invalid event emitted");
  });

  // 5th Test
  it("Testing smart contract function buyItem() that allows a distributor to buy coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    var eventEmitted = false;

    // Watch the emitted event Sold()
    var event = supplyChain.Sold();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as Sold by calling function buyItem()
    await supplyChain.buyItem(upc, {
      from: distributorID,
      value: productPrice,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferTwo[5], 2, "Error: Invalid item State");
    assert.equal(
      resultBufferTwo[3],
      distributorID,
      "Error: Invalid DistributorID"
    );
    assert.equal(eventEmitted, true, "Invalid event emitted");
  });

  // 6th Test
  it("Testing smart contract function shipItem() that allows a distributor to ship coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    var eventEmitted = false;

    // Watch the emitted event Shipped()
    var event = supplyChain.Shipped();
    await event.watch((err, res) => {
      eventEmitted = true;
    });

    // Mark an item as Sold by calling function shipItem()
    await supplyChain.shipItem(upc, { from: distributorID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(resultBufferTwo[5], 3, "Error: Invalid item State");
    assert.equal(eventEmitted, true, "Invalid event emitted");
  });

  // 7th Test
  it("Testing smart contract function receiveItem() that allows a retailer to mark coffee received", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    var event = supplyChain.Received();

    // Watch the emitted event Received()
    await event.watch((err, res) => {
      eventEmitted = res.event;
    });

    // Mark an item as Sold by calling function receiveItem()
    await supplyChain.receiveItem(upc, { from: retailerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const fetchedData = await supplyChain.fetchItem.call(upc);

    // Verify the result set
    assert.equal(fetchedData[6], retailerID, "Error: Invalid retailerID");
    assert.equal(fetchedData[5], 6, "Error: Invalid itemState");
  });

  // 8th Test
  it("Testing smart contract function purchaseItem() that allows a consumer to purchase coffee", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Declare and Initialize a variable for event
    var event = supplyChain.Purchased();

    // Watch the emitted event Purchased()
    await event.watch((err, res) => {
      assert.equal(res.event, "Purchased", "Invalid event emitted");
    });

    // Mark an item as Purchased by calling function purchaseItem()
    await supplyChain.purchaseItem(sku, web3.eth.defaultAccount, {
      from: consumer,
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const item = await supplyChain.fetchItem.call(sku);

    // Verify the result set
    assert.equal(item.sku, sku, "Error: Invalid item SKU");
    assert.equal(item.upc, upc, "Error: Invalid item UPC");
    assert.equal(item.ownerID, consumer, "Error: Missing or Invalid ownerID");
    assert.equal(
      item.originFarmerID,
      farmer,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      item.originFarmName,
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      item.originFarmInformation,
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      item.originFarmLatitude,
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      item.originFarmLongitude,
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      item.productID,
      productID,
      "Error: Missing or Invalid productID"
    );
    assert.equal(
      item.productNotes,
      productNotes,
      "Error: Missing or Invalid productNotes"
    );
    assert.equal(
      item.productPrice,
      productPrice,
      "Error: Missing or Invalid productPrice"
    );
    assert.equal(item.itemState, 7, "Error: Invalid item state");
  });

  // 9th Test
  it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const item = await supplyChain.fetchItemBufferOne(upc);

    // Verify the result set:
    assert.equal(item.sku, sku, "Error: Invalid item SKU");
    assert.equal(item.upc, upc, "Error: Invalid item UPC");
    assert.equal(item.ownerID, farmerID, "Error: Missing or Invalid ownerID");
    assert.equal(
      item.originFarmerID,
      farmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      item.originFarmName,
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      item.originFarmInformation,
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      item.originFarmLatitude,
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      item.originFarmLongitude,
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
    assert.equal(
      item.productID,
      productID,
      "Error: Missing or Invalid productID"
    );
    assert.equal(
      item.productNotes,
      productNotes,
      "Error: Missing or Invalid productNotes"
    );
    assert.equal(
      item.productPrice,
      productPrice,
      "Error: Missing or Invalid productPrice"
    );
    assert.equal(item.itemState, 2, "Error: Invalid item State");
  });

  // 10th Test
  it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()

    const sku = 1;
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(sku);

    // Verify the result set:
    assert.equal(resultBufferTwo[0], 2, "Error: Invalid item state");
    assert.equal(resultBufferTwo[1], accounts[1], "Error: Invalid ownerID");
    assert.equal(
      resultBufferTwo[2],
      accounts[2],
      "Error: Invalid originFarmerID"
    );
    assert.equal(
      resultBufferTwo[3],
      "coffee beans",
      "Error: Invalid item name"
    );
    assert.equal(resultBufferTwo[4], 20, "Error: Invalid item price");
    assert.equal(
      resultBufferTwo[5],
      accounts[3],
      "Error: Invalid distributorID"
    );
    assert.equal(resultBufferTwo[6], accounts[4], "Error: Invalid retailerID");
    assert.equal(resultBufferTwo[7], accounts[5], "Error: Invalid consumerID");
  });
});
