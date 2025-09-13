const Category = require("../models/category");

const getCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (error) {
    console.error("Error fetching categories", error);
    res.status(500).json({ error: "Error fetching categories" });
  }
};

const addCategory = async (req, res) => {
  try {
    const { menu_type_name } = req.body;

    const newCategory = new Category({
      menu_type_name,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category", error);
    res.status(500).json({ error: "Error creating category" });
  }
};

// Edit category
const editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { menu_type_name } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { menu_type_name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category", error);
    res.status(500).json({ error: "Error updating category" });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category", error);
    res.status(500).json({ error: "Error deleting category" });
  }
};

module.exports = { getCategory, addCategory, editCategory, deleteCategory };
