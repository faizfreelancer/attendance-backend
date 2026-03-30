const fetch = require("node-fetch");

module.exports = {
  async loginWithGoogle(accessToken) {
    const res = await fetch(
      `https://ruangkerja.maya.id/api/auth/login/google?appKey=${sails.config.ruangkerjaAppKey}&access_token=${accessToken}`,
    );

    const data = await res.json();

    if (!data.token) {
      throw new Error("Login RK gagal");
    }

    return data.token;
  },

  async getProfile(token) {
    const res = await fetch(
      `https://ruangkerja.maya.id/api/dev/account/me?appKey=${sails.config.ruangkerjaAppKey}&token=${token}`,
    );

    const data = await res.json();

    if (data.result !== "success") {
      throw new Error("Token RK tidak valid");
    }

    return data.data;
  },
};
