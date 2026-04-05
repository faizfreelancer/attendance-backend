module.exports = {
  attributes: {
    userId: {
      model: "user",
      required: true,
    },

    attendanceId: {
      model: "attendance",
      required: true,
    },

    type: {
      type: "string",
      isIn: ["check-in", "check-out"],
      required: true,
    },

    logTime: {
      type: "ref", // Date object
      columnType: "datetime",
      required: true,
    },

    logDate: {
      type: "string",
      required: true, // format YYYY-MM-DD
    },
  },
};
