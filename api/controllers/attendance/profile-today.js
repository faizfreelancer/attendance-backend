module.exports = async function (req, res) {
  try {
    const user = req.user;

    const attendance = await AttendanceService.getTodayAttendanceByUser(
      user.id,
    );

    // kalau belum check-in
    if (!attendance) {
      return res.ok({
        message: "Belum ada attendance hari ini",
        data: null,
        logs: [],
      });
    }

    const logs = await UserLogService.getMyLogsLast3Days(user.id);

    if (!logs || logs.length === 0) {
      return res.ok({
        message: "Berhasil mengambil attendance hari ini tanpa logs",
        data: attendance,
        logs: [],
      });
    }

    return res.ok({
      message: "Berhasil mengambil attendance dan logs hari ini",
      data: attendance,
      logs: logs,
    });
  } catch (err) {
    return res.serverError({
      error: err.message,
    });
  }
};
