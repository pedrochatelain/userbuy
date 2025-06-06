const { getDb } = require('../../config/database.mongodb.js');
const { ObjectId } = require('mongodb');
const { UserNotFound } = require('../../errors/customErrors')

function getUsersCollection() {
  return getDb().collection('users');
}

async function getActiveUsers() {
  return await getUsersCollection().find({ isDeleted: { $ne: true } }).toArray()
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

async function update(id, data) {
  const usersCollection = getUsersCollection();
  // Validate the ID
  if (!ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }
  // Convert ID to ObjectId
  const documentID = new ObjectId(id);
  try {
    // Perform the update operation
    const result = await usersCollection.updateOne(
      { _id: documentID }, // Filter
      { $set: data } // Update
    );
    // Handle case where no document is matched
    if (result.matchedCount === 0) {
      throw new UserNotFound();
    }
    // Return the updated document (optional)
    return await usersCollection.findOne({ _id: documentID });
  } catch (error) {
    throw error;
  }
}

async function createUser(user) {
  const usersCollection = await getUsersCollection()
  const result = await usersCollection.insertOne(user);
  return { ...user, _id: result.insertedId };
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

async function getBalances(idUser) {
  try {
    const usersCollection = getUsersCollection();
    
    // Use projection to only include the 'balances' field in the result
    const user = await usersCollection.findOne(
      { _id: new ObjectId(idUser) }, // Query to find the user by ID
      { projection: { balances: 1 } } // Only include 'balances' in the result
    );

    // Check if the 'balances' field exists
    if (user && 'balances' in user) {
      return user.balances;
    }
    
    // Return null or an appropriate value if 'balances' does not exist
    return null;
  } catch (err) {
    throw err; // Re-throw the error for the caller to handle
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
  getActiveUsers,
  existsUser,
  getUserByUsername,
  getUser,
  updateUserRole,
  addToBalances,
  deleteUser,
  createUser,
  update,
  getBalances
};
