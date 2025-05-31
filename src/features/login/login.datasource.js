const { getDb } = require('../../config/database.mongodb.js');
const { ObjectId } = require('mongodb');
const { TokenAlreadyBlacklisted } = require('../../errors/customErrors.js');

function getBlacklistedTokens() {
  return getDb().collection('blacklistedTokens');
}

async function addToBlacklist(token) {
    try {
        await getBlacklistedTokens().insertOne({ _id: token });
        return { token };
    } catch (err) {
        if (err.code === 11000) { // 11000 is the code for duplicate key error
            throw new TokenAlreadyBlacklisted()
        }
        throw err;
    }
}

module.exports = {
    addToBlacklist
};
