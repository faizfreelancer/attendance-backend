module.exports = async function (req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.forbidden({ error: "Unauthorized" });
    }

    req
      .file("photo")
      .upload({ maxBytes: 10000000 }, async function (err, uploadedFiles) {
        // Kalau ada error saat proses upload file
        if (err) return res.serverError(err);

        // Kalau tidak ada file yang dikirim
        if (!uploadedFiles || uploadedFiles.length === 0) {
          return res.badRequest({ error: "Foto wajib" });
        }

        // Ambil data teks dari body SETELAH upload selesai
        // (Skipper harus selesai dulu baru req.body bisa dibaca)
        const { lat, long, note, tasks } = req.body;

        // Parse task dari string ke array karena form-data kirim sebagai string
        // const parsedTasks = tasks ? JSON.parse(tasks) : null;

        let parsedTasks = null;

        if (tasks) {
          try {
            parsedTasks = JSON.parse(tasks);
          } catch (err) {
            sails.log.error("Tasks parse error:", err);
            parsedTasks = [];
          }
        }

        try {
          // Panggil AttendanceService.checkOut dengan data lengkap
          // uploadedFiles[0].fd → path/lokasi file yang tersimpan sementara di server
          const result = await AttendanceService.checkOut(user.id, {
            lat,
            long,
            photo: uploadedFiles[0].fd, // path file hasil upload Skipper
            note, // note yang masih berupa string
            tasks: parsedTasks, // tasks yang sudah diparsing jadi array
          });

          // Kalau semua proses berhasil, return response sukses
          return res.ok({
            message: "Check-out berhasil",
            data: result,
          });
        } catch (err) {
          // Kalau ada error di AttendanceService (misal: sudah check-in, diluar radius, dll)
          return res.badRequest({ error: err.message });
        }
      });
  } catch (err) {
    return res.badRequest({
      error: err.message,
    });
  }
};
