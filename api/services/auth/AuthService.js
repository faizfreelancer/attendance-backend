module.exports = {
  async auth(accessToken) {
    // 1. Tukar ke RK token
    const rkToken = await RuangKerjaService.loginWithGoogle(accessToken);

    // 2. Ambil profile
    const profile = await RuangKerjaService.getProfile(rkToken);

    // 3. Sync user
    const user = await UserService.findOrCreate(profile);

    return {
      user,
      rkToken,
    };
  },
};
