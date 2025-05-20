const { getDb } = require('../../config/database.mongodb.js');
const { ObjectId } = require('mongodb');
const { UserNotFound } = require('../../errors/customErrors')

function getUsersCollection() {
  return getDb().collection('users');
}

async function getUser(idUser) {
  const usersCollection = getUsersCollection();

  // Check if idUser is valid before attempting to create an ObjectId
  if (!ObjectId.isValid(idUser)) {
    return null; // Return null or handle invalid ID cases appropriately
  }

  const documentID = ObjectId.createFromHexString(idUser);

  try {
    return await usersCollection.findOne({ _id: documentID });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function getUserByUsername(username) {
  const usersCollection = getUsersCollection();
  try {
    return await usersCollection.findOne({ username: username });
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function existsUser(idUser) {
  const exists = await getUser(idUser) != null
  return exists
}

async function updateUserRole(idUser, roles) {
  const result = await getUsersCollection().updateOne(
    { _id: new ObjectId(idUser) },
    { $set: { role: roles } }
  )
  if (result.matchedCount === 0) {
    throw new UserNotFound()
  }
  return result
}

async function addToBalances(idUser, amount, session = null) {
  try {
    const usersCollection = getUsersCollection();
    const options = session ? { session } : {};
    await usersCollection.updateOne(
        { _id: new ObjectId(idUser) },
        { $inc: { balances: amount } },
        options
    );
  } catch (err) {
    throw err
  }
}

async function deleteUser(idUser) {
  return await getUsersCollection().findOneAndUpdate(
    { _id: new ObjectId(idUser) },
    { $set: {isDeleted: true} },
    { returnDocument: 'after'}
  )
}

module.exports = {
  getUsersCollection,
  existsUser,
  getUserByUsername,
  getUser,
  updateUserRole,
  addToBalances,
  deleteUser
};
