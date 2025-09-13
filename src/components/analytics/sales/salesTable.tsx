// src/components/sales/SalesTable.tsx
import { useMemo, useState } from "react"
import { DataTable } from "../orders/datatable"
import type { ColumnDef } from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Input } from "../../ui/input"

export interface Sales {
  _id: string
  total_price: number
  createdAt: string
  updatedAt?: string
}

const salesColumns: ColumnDef<Sales>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const rawDate = row.getValue("createdAt") as string
      const dateObj = new Date(rawDate)
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      return <span>{formattedDate}</span>
    },
  },
  {
    id: "dayOfWeek",
    header: "Day",
    cell: ({ row }) => {
      const rawDate = row.getValue("createdAt") as string
      const dateObj = new Date(rawDate)
      const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" })
      return <span className="border py-1 px-2 rounded-lg border-gray-300">{weekday}</span>
    },
  },
  {
    accessorKey: "total_price",
    header: "Revenue",
    cell: ({ row }) => <span>₱{row.getValue("total_price")}</span>,
  },
]


interface SalesTableProps {
  sales: Sales[]
}

export function SalesTable({ sales }: SalesTableProps) {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const filteredRows = useMemo(() => {
    const searched = sales.filter((sale) =>
      new Date(sale.createdAt)
        .toLocaleDateString()
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    if (filter === "all") return searched

    const now = new Date()
    return searched.filter((sale) => {
      const saleDate = new Date(sale.createdAt)

      switch (filter) {
        case "today":
          return saleDate.toDateString() === now.toDateString()
        case "yesterday": {
          const yest = new Date()
          yest.setDate(now.getDate() - 1)
          return saleDate.toDateString() === yest.toDateString()
        }
        case "3days": {
          const cutoff = new Date()
          cutoff.setDate(now.getDate() - 3)
          return saleDate >= cutoff
        }
        case "7days": {
          const cutoff = new Date()
          cutoff.setDate(now.getDate() - 7)
          return saleDate >= cutoff
        }
        case "30days": {
          const cutoff = new Date()
          cutoff.setDate(now.getDate() - 30)
          return saleDate >= cutoff
        }
        default:
          return true
      }
    })
  }, [sales, filter, search])

  return (
    <div className="p-6 space-y-4 bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-xl font-semibold">Sales History</h1>

        <div className="flex flex-col md:flex-row gap-4">
          {/* 🔍 Search */}
          <Input
            placeholder="Search by Date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[200px]"
          />

          {/* 📅 Filter */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
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

      <DataTable columns={salesColumns} data={filteredRows} />
    </div>
  )
}
