module.exports = {
  //Service untuk membuat log user
  async createUserLogs(userId, attendanceId, type) {
    const now = new Date();

    return await UserLog.create({
      user_id: userId,
      attendance_id: attendanceId,
      type: type,
      logTime: now,
      logDate: now.toISOString().split("T")[0],
    }).fetch();
  },

  // Get log user dalam 3 hari terakhir
  async getMyLogsLast3Days(userId) {
    const today = new Date();

    const endDate = today.toISOString().slice(0, 10);

    const past = new Date();
    past.setDate(today.getDate() - 2);

    const startDate = past.toISOString().slice(0, 10);

    return await UserLog.find({
      where: {
        user_id: userId,
        logDate: {
          ">=": startDate,
          "<=": endDate,
        },
      },
      sort: [{ logDate: "DESC" }, { logTime: "DESC" }],
    });
  },
};
