module.exports = async function (req, res) {
  try {
    // Ambil data user yang sudah di-inject oleh policy isAuthenticated
    const user = req.user;

    // Kalau user tidak ada, tolak request
    if (!user) {
      return res.forbidden({ error: "Unauthorized" });
    }

    // Ambil data teks dari body (lat, long, notes)
    // photo tidak diambil dari sini karena photo adalah file, bukan teks
    const { lat, long, notes } = req.body;

    // Ambil file foto menggunakan Skipper (built-in file handler Sails)
    // req.file("photo") → ambil file dengan nama field "photo" dari request
    // maxBytes: 10000000 → batas maksimal ukuran file 10MB
    req
      .file("photo")
      .upload({ maxBytes: 10000000 }, async function (err, uploadedFiles) {
        // Kalau ada error saat proses upload file
        if (err) return res.serverError(err);

        // Kalau tidak ada file yang dikirim
        if (!uploadedFiles || uploadedFiles.length === 0) {
          return res.badRequest({ error: "Foto wajib" });
        }

        try {
          // Panggil AttendanceService.checkIn dengan data lengkap
          // uploadedFiles[0].fd → path/lokasi file yang tersimpan sementara di server
          const result = await AttendanceService.checkIn(user.id, {
            lat,
            long,
            photo: uploadedFiles[0].fd, // path file hasil upload Skipper
            notes,
          });

          // Kalau semua proses berhasil, return response sukses
          return res.ok({
            message: "Check-in berhasil",
            data: result,
          });
        } catch (err) {
          // Kalau ada error di AttendanceService (misal: sudah check-in, diluar radius, dll)
          return res.badRequest({ error: err.message });
        }
      });
  } catch (err) {
    // Kalau ada error diluar proses upload (misal: error parsing request)
    return res.badRequest({
      error: err.message,
    });
  }
};
