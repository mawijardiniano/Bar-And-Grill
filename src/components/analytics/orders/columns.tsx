// src/components/orders/columns.tsx
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../ui/button"
import type { OrderRow } from "@/utils/types"

export const columns: ColumnDef<OrderRow>[] = [
  {
    accessorKey: "createdAt",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string)
      return (
        <span>
          {date.toLocaleDateString()}{" "}
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      )
    },
  },
  {
    accessorKey: "menu_items",
    header: "Items",
    cell: ({ row }) => {
      const items = (row.getValue("menu_items") as string).split(", ")
      return (
        <div className="flex flex-col">
          {items.map((item, idx) => (
            <span key={idx}>{item}</span> // each item on its own line
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "total_price",
    header: "Total",
    cell: ({ row }) => <span>₱{row.getValue("total_price")}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <Button variant="outline" size="sm">
        Edit
      </Button>
    ),
  },
]
