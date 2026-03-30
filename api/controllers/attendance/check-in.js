module.exports = async function (req, res) {
  try {
    const geoCheck = await GeoService.isWithinRadius(req.body);

    return res.ok(geoCheck);
  } catch (err) {
    return res.badRequest({ error: err.message });
  }
};
