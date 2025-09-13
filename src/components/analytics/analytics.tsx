import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import  { useEffect, useState } from "react"
import { OrderTable } from "../../components/analytics/orders/orderTable"
import { SalesTable } from "./sales/salesTable"
import type { Order } from "@/utils/types"
import Chart from "./sales/sales_chart/chart"
import axios from "axios"

// Define Sales type
interface Sales {
  _id: string
  total_price: number
  createdAt: string
}

const Analytics = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [sales, setSales] = useState<Sales[]>([])
  const GET_ORDERS_API = "http://localhost:3000/api/order" // 🔹 same API

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(GET_ORDERS_API)
        const fetchedOrders: Order[] = res.data
        setOrders(fetchedOrders)

        // 🔹 Convert orders → daily sales
        const salesMap: Record<string, number> = {}

        fetchedOrders.forEach((order) => {
          const date = new Date(order.createdAt).toISOString().split("T")[0] // YYYY-MM-DD
          if (!salesMap[date]) salesMap[date] = 0
          salesMap[date] += order.total_price
        })

        const salesData: Sales[] = Object.entries(salesMap).map(([date, total]) => ({
          _id: date,
          total_price: total,
          createdAt: date,
        }))

        setSales(salesData)
      } catch (err) {
        console.error("Error fetching orders:", err)
      }
    }
    fetchOrders()
  }, [])

  return (
    <Tabs defaultValue="analytics" className="w-full pt-2">
      <TabsList className="bg-gray-50 rounded-md">
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="history">Order History</TabsTrigger>
        <TabsTrigger value="sales">Daily Sales</TabsTrigger>
      </TabsList>

      <TabsContent value="analytics">
        <div className="p-4"><Chart/></div>
      </TabsContent>

      <TabsContent value="history">
        <OrderTable orders={orders} />
      </TabsContent>

      <TabsContent value="sales">
        <SalesTable sales={sales} />
      </TabsContent>
    </Tabs>
  )
}

export default Analytics
