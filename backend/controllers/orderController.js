const Order = require("../models/order");
const Menu = require("../models/menu");

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.menu_id", "menu_name menu_price");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    let total_price = 0;
    const orderItems = [];

    for (let item of items) {
      const menu = await Menu.findById(item.menu_id);
      if (!menu) {
        return res.status(404).json({ message: `Menu not found: ${item.menu_id}` });
      }

      const subtotal = menu.menu_price * item.quantity;
      total_price += subtotal;

      orderItems.push({
        menu_id: menu._id,
        menu_name: menu.menu_name,   // snapshot
        menu_price: menu.menu_price, // snapshot
        quantity: item.quantity,
      });
    }

    const newOrder = new Order({ items: orderItems, total_price });
    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const editOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { items } = req.body;

    let total_price = 0;
    const updatedItems = [];

    for (let item of items) {
      const menu = await Menu.findById(item.menu_id);
      if (!menu) {
        return res.status(404).json({ message: `Menu not found: ${item.menu_id}` });
      }

      const subtotal = menu.menu_price * item.quantity;
      total_price += subtotal;

      updatedItems.push({
        menu_id: menu._id,
        menu_name: menu.menu_name,   // snapshot again
        menu_price: menu.menu_price, // snapshot again
        quantity: item.quantity,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { items: updatedItems, total_price },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  editOrder,
  deleteOrder,
};
