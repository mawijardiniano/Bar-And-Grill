const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        menu_id: { type: mongoose.Schema.Types.ObjectId, ref: "Menu", required: true },
        menu_name: { type: String, required: true },  // snapshot
        menu_price: { type: Number, required: true }, // snapshot
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    total_price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
