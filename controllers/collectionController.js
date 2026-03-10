const Collection = require("../models/Collection");
const Store = require("../models/Store");

exports.saveCollection = async (req, res) => {
  const { storeId, amount, date, saleAmount, description } = req.body;

  if (!storeId || !date) {
    return res
      .status(400)
      .json({ message: "Store and date are required" });
  }

  try {
    let store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const collectionDate = new Date(date);
    let targetStoreId = storeId;

    // Validation: Collection cannot exceed Sale Amount
    if (saleAmount && saleAmount > 0) {
      if (amount && amount > saleAmount) {
        return res.status(400).json({ message: `Collection amount (${amount}) cannot exceed Sale amount (${saleAmount})` });
      }

      const newStore = await Store.create({
        storeName: store.storeName,
        pageNumber: store.pageNumber,
        targetAmount: saleAmount,
        totalCollected: amount || 0,
        remainingAmount: saleAmount - (amount || 0),
        date: collectionDate,
        description: description,
        status: "active"
      });
      targetStoreId = newStore._id;
      store = newStore;
    } else if (amount && amount > 0) {
      // Validation: Collection cannot exceed Current Remaining Amount
      if (amount > store.remainingAmount) {
        return res.status(400).json({ message: `Collection amount (${amount}) cannot exceed Due Balance (${store.remainingAmount})` });
      }

      // Only payment, update existing store
      store.totalCollected += amount;
      store.remainingAmount = store.targetAmount - store.totalCollected;
      await store.save();
    }

    // 2. Create/Update Collection record for the target store
    if (amount !== undefined && amount !== null && amount > 0) {
      // Find existing collection for this store & date
      let collection = await Collection.findOne({
        storeId: targetStoreId,
        date: collectionDate,
      });

      if (collection) {
        collection.amount += amount;
        if (description) {
          collection.description = collection.description
            ? collection.description + "; " + description
            : description;
        }
        await collection.save();
      } else {
        await Collection.create({
          storeId: targetStoreId,
          date: collectionDate,
          amount,
          description,
        });
      }
    }

    res.json({ message: "Transaction saved successfully", store });
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
