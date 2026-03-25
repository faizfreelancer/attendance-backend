/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    external_id: {
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

    role: {
      type: "string",
      isIn: ["admin", "user"],
      defaultsTo: "user",
    },
  },
};

