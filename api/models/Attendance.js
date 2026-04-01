module.exports = {
  attributes: {
    user_id: {
      model: "user",
      required: true,
    },

    office_id: {
      model: "office",
      required: true,
    },

    date: {
      type: "string", // format: YYYY-MM-DD
      required: true,
    },

    check_in_time: {
      type: "ref",
      columnType: "timestamp",
    },

    check_out_time: {
      type: "ref",
      columnType: "timestamp",
    },

    check_in_lat: {
      type: "number",
      allowNull: true,
    },

    check_in_long: {
      type: "number",
      allowNull: true,
    },

    check_out_lat: {
      type: "number",
      allowNull: true,
    },

    check_out_long: {
      type: "number",
      allowNull: true,
    },

    check_in_photo_url: {
      type: "string",
      allowNull: true,
    },

    check_out_photo_url: {
      type: "string",
      allowNull: true,
    },

    check_in_notes: {
      type: "string",
      // allowNull: true
    },

    check_out_notes: {
      type: "string",
      // allowNull: true
    },

    check_in_task: {
      type: "json",
      // allowNull: true
    },

    check_out_task: {
      type: "json",
      // allowNull: true
    },

    isCheckedOut: {
      type: "boolean",
      defaultsTo: false,
    },
  },
};