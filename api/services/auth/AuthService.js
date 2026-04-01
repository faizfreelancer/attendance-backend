const RuangKerjaService = require("./RuangKerjaService");
const UserService = require("./UserService");

module.exports = {
  async auth(accessToken) {
    // 1. Tukar ke RK token
    const { accessToken: rkToken, email } =
      await RuangKerjaService.loginWithGoogle(accessToken);

    // 2. Ambil profile
    const profile = await RuangKerjaService.getProfile(rkToken);

    // 3. Sync user (kirim email sebagai parameter terpisah)
    const user = await UserService.findOrCreate(profile, email);

    return {
      user,
      rkToken,
    };
  },
};
