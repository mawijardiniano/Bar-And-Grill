const express = require("express");
const {
  getMenu,
  createMenu,
  editMenu,
  deleteMenu,
} = require("../controllers/menuController");

const router = express.Router();

router.get("/", getMenu);      
router.post("/", createMenu);     
router.put("/:id", editMenu);    
router.delete("/:id", deleteMenu);

module.exports = router;
