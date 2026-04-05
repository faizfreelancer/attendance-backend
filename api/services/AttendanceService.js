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
      officeId: geo.officeId, // ← dari geo
      date: today,
      checkInTime: new Date(),
      checkInLat: lat,
      checkInLong: long,
      checkInPhotoUrl: photoUrl,
      checkInNote: note, // ← simpan note apa adanya (bisa null atau array)
      checkInTasks: Array.isArray(tasks) ? tasks : [],
      checkOutTasks: [], // ← default empty array
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
      checkOutTime: checkOutTime,
      checkOutLat: lat,
      checkOutLong: long,
      checkOutPhotoUrl: photoUrl,
      checkOutNote: note || null,
      checkOutTasks: Array.isArray(tasks) ? tasks : [],
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
