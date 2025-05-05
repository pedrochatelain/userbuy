const { getDb } = require('../../datasources/mongoConnection');
const { ObjectId } = require('mongodb');
const { UserNotFound } = require('../../errors/customErrors')

function getUsersCollection() {
  return getDb().collection('users');
}

async function getUser(userID) {
  const usersCollection = getUsersCollection();

  // Check if userID is valid before attempting to create an ObjectId
  if (!ObjectId.isValid(userID)) {
    return null; // Return null or handle invalid ID cases appropriately
  }

  const documentID = ObjectId.createFromHexString(userID);

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

async function existsUser(userID) {
  const exists = await getUser(userID) != null
  return exists
}

async function updateUserRole(userId, roles) {
  const result = await getUsersCollection().updateOne(
    { _id: new ObjectId(userId) },
    { $set: { role: roles } }
  )
  if (result.matchedCount === 0) {
    throw new UserNotFound()
  }
  return result
}

async function addToBalances(userId, amount, session = null) {
  try {
    const usersCollection = getUsersCollection();
    const options = session ? { session } : {};
    await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
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
