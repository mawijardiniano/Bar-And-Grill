// src/pages/OrdersPage.tsx
import { useEffect, useState } from "react"
import axios from "axios"
import type { Order } from "@/utils/types"
import { OrderTable } from "@/components/analytics/orders/orderTable"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/order")
        setOrders(res.data)
      } catch (err) {
        console.error("Failed to fetch orders:", err)
      }
    }

    fetchOrders()
  }, [])

  return <OrderTable orders={orders} />
}
