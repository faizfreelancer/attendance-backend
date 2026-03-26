/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const fetch = require("node-fetch");

module.exports = async function (req, res) {
  try {
    // 1. Ambil bearer token dari header
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ada" });
    }

    const accessToken = authHeader.split(" ")[1];

    // 2. Verifikasi ke RuangKerja
    const rkResponse = await fetch(
      `https://ruangkerja.maya.id/api/dev/account/me?appKey=${sails.config.ruangkerjaAppKey}&token=${accessToken}`,
    );
    const rkData = await rkResponse.json();

    // 3. Valid atau tidak
    if (rkData.result !== "success") {
      return res.status(401).json({ message: "Token tidak valid" });
    }

    // 4. Cek status akun
    if (rkData.data.accountStatus !== "Active") {
      return res.status(401).json({ message: "Akun tidak aktif" });
    }

    // 5. Cek akun dihapus atau tidak
    if (rkData.data.deleted !== 0) {
      return res.status(401).json({ message: "Akun telah dihapus" });
    }

    return res.ok({
      message: "Token valid!",
      user: rkData.data.firstName,
    });
  } catch (err) {
    return res.serverError(err);
  }
};
