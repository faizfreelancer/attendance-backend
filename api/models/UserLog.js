module.exports = {
  attributes: {
    user_id: {
      model: "user",
      required: true,
    },

    attendance_id: {
      model: "attendance",
      required: true,
    },

    type: {
      type: "string",
      isIn: ["check-in", "check-out"],
      required: true,
    },

    log_time: {
      type: "ref", // Date object
      columnType: "timestamp",
      required: true,
    },

    log_date: {
      type: "string",
      required: true, // format YYYY-MM-DD
    },
  },
};
