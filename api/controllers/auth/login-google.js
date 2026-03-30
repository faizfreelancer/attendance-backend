module.exports = async function (req, res) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.badRequest({ error: "Google token tidak ada" });
    }

    const googleToken = authHeader.split(" ")[1];

    const result = await AuthService.loginWithGoogle(googleToken);

    return res.ok({
      message: "Login berhasil",
      user: result.user,
      token: result.rkToken,
    });
  } catch (err) {
    return res.badRequest({
      error: err.message,
    });
  }
};
