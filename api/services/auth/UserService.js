module.exports = {
  async findOrCreate(profile, email) {
    let user = await User.findOne({ external_id: profile.id });

    if (!user) {
      user = await User.create({
        external_id: profile.id,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: email,
        isAdmin: profile.isAdmin,
      }).fetch();

      return user;
    }

    return await User.updateOne({ id: user.id }).set({
      firstName: profile.firstName,
      lastName: profile.lastName,
    });
  },
};
