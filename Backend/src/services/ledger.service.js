// FILE: backend/src/services/ledger.service.js
const LedgerEntry = require('../models/ledgerEntry.model');

/**
 * Creates a new ledger entry for stock movements.
 * @param {Object} entryData - The data for the ledger entry.
 * @param {Object} session - The Mongoose transaction session.
 * @returns {Promise<Object>} The created ledger entry.
 */
const createEntry = async (entryData, session) => {
  const [entry] = await LedgerEntry.create([entryData], { session });
  return entry;
};

module.exports = {
  createEntry,
};