module.exports = {
  attributes: {
    name: { type: "string", required: true },
    status: {
      type: "string",
      isIn: ["todo", "in_progress", "in_review", "done"],
      defaultsTo: "todo",
    },
    priority: {
      type: "string",
      isIn: ["low", "normal", "high", "urgent"],
      defaultsTo: "normal",
    },
    dueDate: { type: "ref", columnType: "datetime" },
    userId: { model: "user", required: true },
    attendanceId: { model: "attendance", required: true },
  },
};
