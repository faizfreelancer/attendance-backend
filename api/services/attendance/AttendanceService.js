module.exports = {
  async checkIn(userId, data) {
    // 1. basic validation
    if (!data.lat || !data.long) {
      throw new Error("Lokasi wajib");
    }

    if (!data.photo) {
      throw new Error("Foto wajib");
    }

    // 2. business rule
    const existing = await Attendance.findOne({
      user_id: userId,
      date: today,
    });

    if (existing) {
      throw new Error("Sudah check-in");
    }

    // 3. geo validation
    const geo = await GeoService.isWithinRadius(data);

    // 4. upload photo
    const photoUrl = await UploadService.uploadImage(data.photo);

    // 5. save
    return await Attendance.create({
      user_id: userId,
      date: today,
      check_in_time: new Date(),
      check_in_lat: data.lat,
      check_in_long: data.long,
      check_in_photo_url: photoUrl,
      check_in_notes: data.notes || null,
    }).fetch();
  },
};
