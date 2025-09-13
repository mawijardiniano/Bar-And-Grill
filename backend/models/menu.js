const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  menu_name: {
    type: String,
    required: true,
  },
  menu_price: {
    type: Number,
    required: true,
  },
  menu_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Menu", menuSchema);
