const RuangKerjaService = require("../services/auth/RuangKerjaService");
module.exports = async function (req, res, proceed) {
  try {
    const authHeader = req.headers.authorization;

    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.forbidden({ error: "Token tidak ada" });
    }

    const rkToken = authHeader.split(" ")[1];


    // Validasi token ke RK
    const profile = await RuangKerjaService.getProfile(rkToken);


    // Ambil user dari DB (role, dll)
    const user = await User.findOne({ external_id: profile.id });

    if (!user) {
      return res.forbidden({ error: "User tidak ditemukan" });
    }

    // Inject ke request
    req.user = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    return proceed();
  } catch (err) {
    console.log("ERROR MESSAGE:", err.message);
    console.log("ERROR STACK:", err.stack);
    return res.forbidden({
      error: "Unauthorized",
    });
  }
};
