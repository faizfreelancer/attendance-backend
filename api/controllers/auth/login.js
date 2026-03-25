/**
 * Auth/google.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const fetch = require("node-fetch");

module.exports = async function (req, res) {
  try {
    const { accessToken } = req.body;

    // 1. Cek accessToken ada atau tidak
    if (!accessToken) {
      return res.badRequest({ message: "accessToken wajib diisi" });
    }

    // 2. Hit RuangKerja /me pakai accessToken
    const rkResponse = await fetch(
      `https://ruangkerja.maya.id/api/dev/account/me?appKey=${sails.config.ruangkerjaAppKey}&token=${accessToken}`,
    );
    const rkData = await rkResponse.json();

    // 3. Cek response RuangKerja valid atau tidak
    if (rkData.result !== "success" || !rkData.data) {
      return res.unauthorized({ message: "Token tidak valid" });
    }

    // 4. Ambil data user dari RuangKerja
    const account = rkData.data;

    // 5. Cek / create user di DB
    let user = await User.findOne({ external_id: account.id });

    if (!user) {
      user = await User.create({
        external_id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.encryptedEmail,
        role: "user",
      }).fetch();
    } else {
      user = await User.updateOne({ id: user.id }).set({
        firstName: account.firstName,
        lastName: account.lastName,
      });
    }

    // 6. Response ke mobile
    return res.ok({
      message: "Login success",
      user,
      accessToken,
    });
  } catch (err) {
    return res.serverError(err);
  }
};

