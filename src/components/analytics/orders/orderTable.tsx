import  { useState, useMemo } from "react"
import type { Order, OrderRow } from "@/utils/types"
import { columns } from "./columns"
import { DataTable } from "./datatable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Input } from "../../ui/input"

interface OrderTableProps {
  orders: Order[]
}

const groupOrders = (orders: Order[]): OrderRow[] => {
  return orders.map((order) => {
    const menu_items = order.items
      .map((item) => `${item.quantity}x ${item.menu_id.menu_name}`)
      .join(", ")

    const total_items = order.items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      orderId: order._id,
      menu_items,
      total_items,
      total_price: order.total_price,
      createdAt: order.createdAt,
    }
  })
}

export function OrderTable({ orders }: OrderTableProps) {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filteredRows = useMemo(() => {
    const rows = groupOrders(orders)

    // 🔍 Search filter
    const searchFiltered = rows.filter((row) => {
      const searchLower = search.toLowerCase()
      return (
        row.orderId.toLowerCase().includes(searchLower) ||
        row.menu_items.toLowerCase().includes(searchLower)
      )
    })

    // 📅 Date filter
    if (filter === "all") return searchFiltered

    const now = new Date()
    return searchFiltered.filter((row) => {
      const createdAt = new Date(row.createdAt)

      switch (filter) {
        case "today":
          return createdAt.toDateString() === now.toDateString()
        case "yesterday": {
          const yesterday = new Date()
          yesterday.setDate(now.getDate() - 1)
          return createdAt.toDateString() === yesterday.toDateString()
        }
        case "3days": {
          const threeDaysAgo = new Date()
          threeDaysAgo.setDate(now.getDate() - 3)
          return createdAt >= threeDaysAgo
        }
        case "7days": {
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(now.getDate() - 7)
          return createdAt >= sevenDaysAgo
        }
        case "30days": {
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(now.getDate() - 30)
          return createdAt >= thirtyDaysAgo
        }
        default:
          return true
      }
    })
  }, [orders, filter, search])

  return (
    <div className="p-6 space-y-4 bg-white rounded-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-semibold">Order History</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by Order ID or Item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[250px]"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="3days">Last 3 Days</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredRows} />
    </div>
  )
}
