const { getDb } = require('../../config/database.mongodb.js');
const { ObjectId } = require('mongodb');

function getBlacklistedTokens() {
  return getDb().collection('blacklistedTokens');
}

async function addToBlacklist(token) {
    // Insert the token as the `_id`
    await getBlacklistedTokens().insertOne({ _id: token });
    // Return the token wrapped in an object
    return { token };
}

module.exports = {
    addToBlacklist
};
