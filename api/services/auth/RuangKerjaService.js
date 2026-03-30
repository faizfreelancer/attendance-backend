const fetch = require("node-fetch");

module.exports = {
  async loginWithGoogle(accessToken) {
    const res = await fetch(
      `https://ruangkerja.maya.id/api/auth/login/google?appKey=${sails.config.ruangkerjaAppKey}&access_token=${accessToken}`,
    );

    const data = await res.json();
    console.log("RESPONSE RK LOGIN:", JSON.stringify(data)); // ← tambah ini

    if (!data.accessToken) {
      throw new Error("Login RK gagal");
    }

    // Return accessToken + email sekalian
    return {
      accessToken: data.accessToken,
      email: data.data.email,
    };
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
