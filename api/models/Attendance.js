module.exports = {
  attributes: {
    userId: {
      model: "user",
      required: true,
    },

    officeId: {
      model: "office",
      required: true,
    },

    date: {
      type: "string", // format: YYYY-MM-DD
      required: true,
    },

    checkInTime: {
      type: "ref",
      columnType: "datetime",
    },

    checkOutTime: {
      type: "ref",
      columnType: "datetime",
    },

    checkInLat: {
      type: "number",
      allowNull: true,
    },

    checkInLong: {
      type: "number",
      allowNull: true,
    },

    checkOutLat: {
      type: "number",
      allowNull: true,
    },

    checkOutLong: {
      type: "number",
      allowNull: true,
    },

    checkInPhotoUrl: {
      type: "string",
      allowNull: true,
    },

    checkOutPhotoUrl: {
      type: "string",
      allowNull: true,
    },

    // checkInNote: {
    //   type: "string",
    //   // allowNull: true
    // },

    // checkOutNote: {
    //   type: "string",
    //   // allowNull: true
    // },

    // checkInTasks: {
    //   type: "json",
    //   // allowNull: true
    // },

    // checkOutTasks: {
    //   type: "json",
    //   // allowNull: true
    // },
    working_hours: {
      type: "number",
      //allowNull: true,
    },

    isCheckedOut: {
      type: "boolean",
      defaultsTo: false,
    },
  },
};
