/**
 * Office.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    latitude:{
      type: 'number',
      required: true,
    },
    longitude: {
      type: 'number',
      required: true,
    },
    radius: {
      type: 'number',
      required: true,
    }
  },

};

