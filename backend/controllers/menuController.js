const Menu = require("../models/menu");
const Category = require("../models/category");

// ✅ Get all active menu items
const getMenu = async (req, res) => {
  try {
    const menu = await Menu.find().populate("menu_type", "menu_type_name");
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createMenu = async (req, res) => {
  try {
    const { menu_name, menu_price, menu_type } = req.body;

    const category = await Category.findById(menu_type);
    if (!category) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const newMenu = new Menu({
      menu_name,
      menu_price,
      menu_type,
      is_active: true, // 🔹 make sure it's always stored
    });

    const savedMenu = await newMenu.save();
    await savedMenu.populate("menu_type", "menu_type_name");

    res.status(201).json(savedMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const editMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_name, menu_price, menu_type, is_active } = req.body;

    if (menu_type) {
      const category = await Category.findById(menu_type);
      if (!category) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { menu_name, menu_price, menu_type, is_active },
      { new: true, runValidators: true }
    ).populate("menu_type", "menu_type_name");

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(updatedMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMenu = await Menu.findByIdAndUpdate(
      id,
      { is_active: false },
      { new: true }
    );

    if (!deletedMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({
      message: "Menu item deactivated (soft deleted)",
      deletedMenu,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMenu, createMenu, editMenu, deleteMenu };
