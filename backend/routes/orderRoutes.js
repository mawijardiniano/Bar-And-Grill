const express = require("express");
const router = express.Router();
const { getOrders, createOrder, editOrder, deleteOrder } = require("../controllers/orderController");

router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:id", editOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
