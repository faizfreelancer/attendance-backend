module.exports = async function (req, res) {
  try {
    //user dari policy (isAuthenticated)
    const user = req.user;

    if (!user) {
      return res.forbidden({ error: "Unauthorized" });
    }

    const { lat, long, photo, notes } = req.body;

    const result = await AttendanceService.checkIn(user.id, {
      lat,
      long,
      photo,
      notes,
    });

    return res.ok({
      message: "Check-in berhasil",
      data: result,
    });
  } catch (err) {
    return res.badRequest({
      error: err.message,
    });
  }
};
