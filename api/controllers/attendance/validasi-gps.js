/**
 * CheckinController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const geolib = require("geolib");

module.exports = async function (req, res) {
  try {
    //2 Ambil GPS dari body
    const { lat, long } = req.body;

    const gpsValidation = await GeoService.isWithinRadius({ lat, long });

    return res.ok(gpsValidation);
  } catch (error) {
    return res.serverError(error);
  }
};
