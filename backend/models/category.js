const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  menu_type_name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
