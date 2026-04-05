/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    externalId: {
      type: "number",
      required: true,
      unique: true,
    },

    firstName: {
      type: "string",
      required: true,
    },

    lastName: {
      type: "string",
    },

    email: {
      type: "string",
      required: true,
      unique: true, // ← tambah ini
    },
    isAdmin: {
      type: "boolean",
      defaultsTo: false,
    },
  },
};
