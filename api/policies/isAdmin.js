module.exports = async function (req, res, proceed) {
  if (!req.user) {
    return res.forbidden({ error: "Unauthorized" });
  }

  if (!req.user.isAdmin) {
    return res.forbidden({
      error: "Hanya admin yang bisa akses",
    });
  }

  return proceed();
};
