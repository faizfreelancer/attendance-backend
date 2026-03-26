/**
 * Auth/google.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const fetch = require("node-fetch");

module.exports = async function (req, res) {
  try {
    const { firstName, lastName, email } = req.body;

    // 1. Ambil token dari header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token tidak ada" });
    }
    const accessToken = authHeader.split(" ")[1];

    // 2. Cek field lain
    if (!firstName || !email) {
      return res.badRequest({ message: "firstName dan email wajib diisi" });
    }

    // 3. Validasi accessToken ke RuangKerja
    const rkResponse = await fetch(
      `https://ruangkerja.maya.id/api/dev/account/me?appKey=${sails.config.ruangkerjaAppKey}&token=${accessToken}`,
    );
    const rkData = await rkResponse.json();

    // 4. Cek token valid atau tidak
    if (rkData.result !== "success" || !rkData.data) {
      return res.status(401).json({ message: "Token tidak valid" });
    }


    // 5. Cek / create user di DB
    let user = await User.findOne({ email: email });

    if (!user) {
      user = await User.create({
        external_id: rkData.data.id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: "user",
      }).fetch();

      return res.status(201).json({
        message: "User baru berhasil dibuat",
        user,
      });
    } else {
      user = await User.updateOne({ id: user.id }).set({
        firstName: firstName,
        lastName: lastName,
        role: "user",
      });


      return res.ok({
        message: "Data user sudah ada di Database",
        user,
      });
    }
  } catch (err) {
    return res.serverError(err);
  }
};

