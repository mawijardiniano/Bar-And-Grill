import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../../ui/chart"

import type {
  ChartConfig,

} from "../../../ui/chart"
import { useEffect, useState } from "react"
import axios from "axios"

export const description = "Orders total price per month"

const chartConfig: ChartConfig = {
  total: {
    label: "Total Orders",
    color: "var(--chart-1)",
  },
}

// Base months
const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

export default function OrdersChart() {
  const [chartData, setChartData] = useState<{ month: string; total: number }[]>([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/order") // fetch all orders
        const orders = res.data

        // Aggregate total price per month
        const totalsMap: Record<string, number> = {}

        orders.forEach((order: { total_price: number; createdAt: string }) => {
          const date = new Date(order.createdAt)
          const month = date.toLocaleString("default", { month: "short" }) // Jan, Feb, etc.
          if (!totalsMap[month]) totalsMap[month] = 0
          totalsMap[month] += order.total_price
        })

        // Build data with all months, filling 0 if no orders
        const data = months.map((m) => ({
          month: m,
          total: totalsMap[m] || 0,
        }))

        setChartData(data)
      } catch (err) {
        console.error("Error fetching orders:", err)
      }
    }

    fetchOrders()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>Showing total sales/revenue per month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="total" fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total order revenue for each month
        </div>
      </CardFooter>
    </Card>
  )
}
