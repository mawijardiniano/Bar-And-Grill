export interface Sales {
  _id: string;
  total_price: number;
  createdAt: string;
  updatedAt?: string;
}
export interface Category {
  _id: string;
  menu_type_name: string;
}

export interface Menu {
  _id: string;
  menu_name: string;
  menu_price: number;
  menu_type: Category;
    is_active: boolean; 
}

export interface OrderItem {
  menu_id: Menu;
  quantity: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  total_price: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderRow {
  orderId: string;
  menu_items: string;
  total_items: number;
  total_price: number;
  createdAt: string;
}
