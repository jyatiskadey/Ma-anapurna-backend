// controllers/collectionController.js
const Collection = require("../models/Collection");

// Save manager collection
exports.saveCollection = async (req, res) => {
  const { storeId, amount, date } = req.body;

  if (!storeId || amount === undefined || !date) {
    return res
      .status(400)
      .json({ message: "Store, amount, and date are required" });
  }

  try {
    // Convert date string to Date object
    const collectionDate = new Date(date);

    // Check if collection for same store & date already exists
    let collection = await Collection.findOne({
      storeId,
      date: collectionDate,
    });

    if (collection) {
      // Update existing collection
      collection.amount = amount;
      await collection.save();
    } else {
      // Create new collection entry
      collection = await Collection.create({
        storeId,
        date: collectionDate,
        amount,
      });
    }

    res.json({ message: "Collection saved successfully", collection });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
