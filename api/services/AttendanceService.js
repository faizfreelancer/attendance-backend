module.exports = {
  /* Check-in service */
  async checkIn(userId, data) {
    const { lat, long, photo, note, tasks } = data;
    const today = new Date().toISOString().split("T")[0]; // ← taruh disini

    sails.log("CHECKIN SERVICE DATA:", data);
    // 1. basic validation
    if (!lat || !long) {
      throw new Error("Lokasi wajib");
    }

    if (!photo) {
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
    const attendance = await Attendance.create({
      user_id: userId,
      office_id: geo.officeId, // ← dari geo
      date: today,
      check_in_time: new Date(),
      check_in_lat: lat,
      check_in_long: long,
      check_in_photo_url: photoUrl,
      check_in_note: note, // ← simpan note apa adanya (bisa null atau array)
      check_in_tasks: Array.isArray(tasks) ? tasks : [],
      check_out_tasks: [], // ← default empty array
    }).fetch();

    // 6. create user log
    try {
      await UserLogService.createUserLogs(userId, attendance.id, "check-in");
    } catch (err) {
      sails.log.error("Failed to create log:", err);
    }

    return attendance;
  },

  /* Check-out service */

  async checkOut(userId, data) {
    const { lat, long, photo, note, tasks } = data;

    sails.log("CHECKOUT SERVICE DATA:", data);
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
      check_out_note: note || null,
      check_out_tasks: Array.isArray(tasks) ? tasks : [],
      isCheckedOut: true,
      working_hours: Number(workingHours.toFixed(2)),
    });

    try {
      await UserLogService.createUserLogs(userId, attendance.id, "check-out");
    } catch (err) {
      sails.log.error("Failed to create log:", err);
    }

    return updated;
  },

  /* getAttendance service (Satu profile)*/
  async getTodayAttendanceByUser(userId) {
    // format: YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10);

    const attendance = await Attendance.findOne({
      user_id: userId,
      date: today,
    });

    return attendance;
  },
};
