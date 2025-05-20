const datasourceUser = require('../user/user.datasource')
const { getDb } = require('../../config/mongoConnection');
const { ObjectId } = require('mongodb');

function getPurchasesCollection() {
    return getDb().collection('purchases');
}

async function purchase(idUser, product) {
  const purchasesCollection = getPurchasesCollection();
  const session = purchasesCollection.client.startSession();

  try {
      session.startTransaction();
      
      // Create the purchase document
      const purchaseDoc = {
          idUser: new ObjectId(idUser),
          product,
          purchaseDate: new Date(),
      };

      // Insert the purchase and capture the inserted ID
      const insertResult = await purchasesCollection.insertOne(purchaseDoc, { session });

      // Update user balance
      await datasourceUser.addToBalances(idUser, -product.price, session);

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
      await datasourceUser.addToBalances(purchase.idUser, purchase.product.price, session);
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

async function getPurchasesUser(idUser) {
  return getPurchasesCollection().find({idUser: new ObjectId(idUser)}).toArray()
}

async function getPurchase(idPurchase) {
  try {
    return await getPurchasesCollection().findOne({_id: new ObjectId(idPurchase)})
  } catch (err) {
    throw err
  }
}

module.exports = { purchase, getPurchases, getPurchasesUser, deletePurchase, getPurchase }