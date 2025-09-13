import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction } from "@reduxjs/toolkit";
import type { Menu, OrderItem } from "@/utils/types";

interface OrderState {
  items: OrderItem[];
  total_price: number;
}

const initialState: OrderState = {
  items: [],
  total_price: 0,
};

// Helper to recalc total
const calculateTotal = (items: OrderItem[]) =>
  items.reduce(
    (sum, item) => sum + item.menu_id.menu_price * item.quantity,
    0
  );

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Menu>) => {
      const menu = action.payload;
      const existingItem = state.items.find(
        (item) => item.menu_id._id === menu._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ menu_id: menu, quantity: 1 });
      }

      state.total_price = calculateTotal(state.items);
    },
    increaseQty: (state, action: PayloadAction<string>) => {
      const menuId = action.payload;
      const item = state.items.find((i) => i.menu_id._id === menuId);
      if (item) {
        item.quantity += 1;
      }
      state.total_price = calculateTotal(state.items);
    },
    decreaseQty: (state, action: PayloadAction<string>) => {
      const menuId = action.payload;
      const item = state.items.find((i) => i.menu_id._id === menuId);
      if (item) {
        item.quantity -= 1;
        if (item.quantity <= 0) {
          state.items = state.items.filter((i) => i.menu_id._id !== menuId);
        }
      }
      state.total_price = calculateTotal(state.items);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.menu_id._id !== action.payload
      );
      state.total_price = calculateTotal(state.items);
    },
    clearOrder: (state) => {
      state.items = [];
      state.total_price = 0;
    },
  },
});

export const {
  addItem,
  increaseQty,
  decreaseQty,
  removeItem,
  clearOrder,
} = orderSlice.actions;
export default orderSlice.reducer;
