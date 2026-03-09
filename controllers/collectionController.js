const Collection = require("../models/Collection");
const Store = require("../models/Store");

exports.saveCollection = async (req, res) => {
  const { storeId, amount, date } = req.body;

  if (!storeId || amount === undefined || !date) {
    return res
      .status(400)
      .json({ message: "Store, amount, and date are required" });
  }

  try {
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const collectionDate = new Date(date);

    // Find existing collection for this store & date
    let collection = await Collection.findOne({
      storeId,
      date: collectionDate,
    });

    if (collection) {
      collection.amount = amount;
      await collection.save();
    } else {
      collection = await Collection.create({
        storeId,
        date: collectionDate,
        amount,
      });
    }

    // Calculate new totalCollected for the store
    const allCollections = await Collection.find({ storeId });
    const totalCollected = allCollections.reduce((sum, c) => sum + c.amount, 0);

    // Update store totals
    store.totalCollected = totalCollected;
    store.remainingAmount = store.targetAmount - totalCollected;
    
    // Ensure remaining amount doesn't go below 0 (optional based on business logic)
    // if (store.remainingAmount < 0) store.remainingAmount = 0;

    await store.save();

    res.json({ message: "Collection saved successfully", collection, store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCollectionsByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  try {
    const collections = await Collection.find({ date: new Date(date) })
      .populate("storeId")   
      .lean();
    res.json({ collections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
