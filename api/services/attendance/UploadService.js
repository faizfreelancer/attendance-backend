const cloudinary = require("../../../config/cloudinary");

module.exports = {
  async uploadImage(file) {
    if (!file) {
      throw new Error("Foto wajib diupload");
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "attendance",
      secure: true,
    });

    return result.secure_url;
  },
};
