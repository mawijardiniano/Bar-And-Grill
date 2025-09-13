// src/pages/Menus.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../components/analytics/orders/datatable";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import type { Menu, Category } from "@/utils/types";

const API_URL = "http://localhost:3000/api/menu";
const CATEGORY_URL = "http://localhost:3000/api/category";

const Menus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    menu_name: "",
    menu_price: "",
    menu_type: "",
  });

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await axios.get(API_URL);
      setMenus(res.data.filter((menu: Menu) => menu.is_active !== false));
    } catch (err) {
      console.error("Error fetching menus:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(CATEGORY_URL);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingMenu) {
        await axios.put(`${API_URL}/${editingMenu._id}`, formData);
      } else {
        await axios.post(API_URL, { ...formData, is_active: true });
      }
      setOpen(false);
      setEditingMenu(null);
      setFormData({ menu_name: "", menu_price: "", menu_type: "" });
      fetchMenus();
    } catch (err) {
      console.error("Error saving menu:", err);
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setFormData({
      menu_name: menu.menu_name,
      menu_price: String(menu.menu_price),
      menu_type: menu.menu_type?._id || "",
    });
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.put(`${API_URL}/${deleteId}`, { is_active: false });
      setDeleteId(null);
      fetchMenus();
    } catch (err) {
      console.error("Error deactivating menu:", err);
    }
  };

  const columns: ColumnDef<Menu>[] = [
    {
      accessorKey: "menu_name",
      header: "Name",
    },
    {
      accessorKey: "menu_price",
      header: "Price",
      cell: ({ row }) => `₱${Number(row.original.menu_price).toFixed(2)}`,
    },
    {
      accessorKey: "menu_type.menu_type_name",
      header: "Category",
      cell: ({ row }) =>
        row.original.menu_type?.menu_type_name || "Uncategorized",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" onClick={() => handleEdit(row.original)}>
            Edit
          </Button>
          {row.original.is_active && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setDeleteId(row.original._id)}
            >
              Deactivate
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Menu Management</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-black text-white rounded-xl hover:bg-black/80 w-full sm:w-auto max-sm:w-40"
              onClick={() => {
                setEditingMenu(null);
                setFormData({ menu_name: "", menu_price: "", menu_type: "" });
              }}
            >
              + Add Menu
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white w-[95vw] sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingMenu ? "Edit Menu" : "Add Menu"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                name="menu_name"
                placeholder="Menu Name"
                value={formData.menu_name}
                onChange={handleInputChange}
              />
              <Input
                name="menu_price"
                type="number"
                placeholder="Price"
                value={formData.menu_price}
                onChange={handleInputChange}
              />
              <Select
                value={formData.menu_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, menu_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.menu_type_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button className="w-full" onClick={handleSave}>
                {editingMenu ? "Update" : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-white w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deactivate</DialogTitle>
          </DialogHeader>
          <p className="text-sm sm:text-base">
            Are you sure you want to deactivate this menu?
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={confirmDelete}
            >
              Deactivate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table (make scrollable on small screens) */}
      <div className="overflow-x-auto">
        <DataTable columns={columns} data={menus} />
      </div>
    </div>
  );
};

export default Menus;
