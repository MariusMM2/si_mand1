/**
 * This file contains the dictionary object of authenticated users,
 * as well as helper methods related to authentication.
 */
const crypto = require("crypto");
const bcrypt = require("bcrypt");

/**
 * Time in seconds until a JWT expires.
 * @type {number}
 */
const jwtExpirySeconds = 60 * 10;

/**
 * Takes in a password string and returns the bcrypt hash value of that password.
 * @param {string} password - The password
 * @returns {string} hash value. of the password
 */
function getHashedPassword(password) {
    return bcrypt.hashSync(password, 10);
}

/**
 * Uses {@link bcrypt.compareSync} to test whether or not
 * the given password matches the given hash value.
 * @param {string} password - The password
 * @param {string} hash - The hash value
 * @returns {boolean} True if they match, false otherwise
 */
function confirmPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
}

/**
 * Generates a 30 bytes random string as hexadecimal values.
 * @returns {string} the random hex string
 */
function generateAuthToken() {
    return crypto.randomBytes(30).toString('hex');
}

module.exports = {
    jwtExpirySeconds: jwtExpirySeconds,
    getHashedPassword: getHashedPassword,
    confirmPassword: confirmPassword,
    generateAuthToken: generateAuthToken
};