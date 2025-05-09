const datasourceUser = require('../user/user.datasource')
const { getDb } = require('../../config/mongoConnection');
const { ObjectId } = require('mongodb');

function getPurchasesCollection() {
    return getDb().collection('purchases');
}

async function purchase(userID, product) {
  const purchasesCollection = getPurchasesCollection();
  const session = purchasesCollection.client.startSession();

  try {
      session.startTransaction();
      
      // Create the purchase document
      const purchaseDoc = {
          userID: new ObjectId(userID),
          product,
          purchaseDate: new Date(),
      };

      // Insert the purchase and capture the inserted ID
      const insertResult = await purchasesCollection.insertOne(purchaseDoc, { session });

      // Update user balance
      await datasourceUser.addToBalances(userID, -product.price, session);

      await session.commitTransaction();

      // Return the full purchase document (fetch it from the database to ensure consistency)
      return await purchasesCollection.findOne({ _id: insertResult.insertedId });
  } catch (error) {
      await session.abortTransaction();
      throw error;
  } finally {
      session.endSession();
  }
}

async function deletePurchase(idPurchase) {
  const purchasesCollection = getPurchasesCollection();
  const session = purchasesCollection.client.startSession();
  try {
      session.startTransaction();
      const purchase = await getPurchasesCollection().findOne({_id: ObjectId.createFromHexString(idPurchase)})
      await datasourceUser.addToBalances(purchase.userID, purchase.product.price, session);
      const deletedPurchase = await purchasesCollection.findOneAndDelete({ _id: ObjectId.createFromHexString(idPurchase) })
      console.log(deletedPurchase)
      await session.commitTransaction();
      return deletedPurchase
  } catch (error) {
      await session.abortTransaction();
      throw error;
  } finally {
      session.endSession();
  }
}

async function getPurchases() {
  return getPurchasesCollection().find().toArray()
}

async function getPurchasesUser(userId) {
  return getPurchasesCollection().find({userID: new ObjectId(userId)}).toArray()
}

async function getPurchase(idPurchase) {
  return await getPurchasesCollection().findOne({_id: new ObjectId(idPurchase)})
}

module.exports = { purchase, getPurchases, getPurchasesUser, deletePurchase, getPurchase }