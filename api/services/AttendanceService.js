module.exports = {
  async checkIn(userId, data) {
    const { lat, long, photo, notes, tasks } = data;
    const today = new Date().toISOString().split("T")[0]; // ← taruh disini
    // 1. basic validation
    if (lat || long) {
      throw new Error("Lokasi wajib");
    }

    if (photo) {
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
    const photoUrl = await UploadService.uploadImage(photo);

    // 5. save
    return await Attendance.create({
      user_id: userId,
      office_id: geo.officeId, // ← dari geo
      date: today,
      check_in_time: new Date(),
      check_in_lat: lat,
      check_in_long: long,
      check_in_photo_url: photoUrl,
      check_in_notes: notes, // ← simpan notes apa adanya (bisa null atau array)
      check_in_task: Array.isArray(tasks) ? tasks : [],
      check_out_task: [], // ← default empty array
    }).fetch();
  },

  async checkOut(userId, data) {
    const { lat, long, photo, notes, tasks } = data;
    // 1. Validasi basic
    if (!lat || !long) {
      throw new Error("Lokasi wajib diisi");
    }

    if (!photo) {
      throw new Error("Foto wajib diupload");
    }

    const today = new Date().toISOString().slice(0, 10);

    // 2. Ambil data attendance hari ini
    const attendance = await Attendance.findOne({
      user_id: userId,
      date: today,
    });

    if (!attendance) {
      throw new Error("Belum melakukan check-in hari ini");
    }

    // 3. Cek sudah check-out atau belum
    if (attendance.isCheckedOut) {
      throw new Error("Anda sudah check-out");
    }

    // 4. Validasi GPS
    await GeoService.isWithinRadius({ lat, long });

    // 5. Upload foto
    const photoUrl = await UploadService.uploadImage(photo);

    // 6. Hitung working hours 🔥
    const checkOutTime = new Date();

    const durationMs = checkOutTime - new Date(attendance.check_in_time);

    const workingHours = durationMs / (1000 * 60 * 60);

    // 7. Update DB
    const updated = await Attendance.updateOne({
      id: attendance.id,
    }).set({
      check_out_time: checkOutTime,
      check_out_lat: lat,
      check_out_long: long,
      check_out_photo_url: photoUrl,
      check_out_notes: notes || null,
      check_out_task: Array.isArray(tasks) ? tasks : [],
      isCheckedOut: true,
      working_hours: Number(workingHours.toFixed(2)),
    });

    return updated;
  },
};
