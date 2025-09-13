import { DollarSign, Calendar, Clock } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import type { Sales } from "../../utils/types";
import Analytics from '../../components/analytics/analytics'

const Dashboard = () => {
  const [orders, setOrders] = useState<Sales[]>([]);

  const GET_ORDERS_API = "http://localhost:3000/api/order";

  // Fetch orders when component mounts
  useEffect(() => {
    const getOrders = async () => {
      try {
        const res = await axios.get(GET_ORDERS_API);
        setOrders(res.data); // ✅ correct
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getOrders();
  }, []);

  // Helpers for filtering
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isThisWeek = (date: Date) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  };


  const totalSales = orders.reduce((sum, order) => sum + order.total_price, 0);

  const weeklySales = orders
    .filter((o) => isThisWeek(new Date(o.createdAt)))
    .reduce((sum, o) => sum + o.total_price, 0);

  const dailySales = orders
    .filter((o) => isToday(new Date(o.createdAt)))
    .reduce((sum, o) => sum + o.total_price, 0);

  return (
    <div>
        <h1 className="pb-4 font-bold text-3xl">Sales Analytics</h1>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Total Sales */}
      <div className="p-6 bg-white shadow rounded-2xl border border-gray-200 flex flex-col">
        <div className="flex items-center gap-2 text-gray-500">
          <DollarSign size={20} />
          <span>Total Sales</span>
        </div>
        <h2 className="text-2xl font-bold mt-2">₱{totalSales.toLocaleString()}</h2>
      </div>

      {/* Weekly Sales */}
      <div className="p-6 bg-white shadow rounded-2xl border border-gray-200 flex flex-col">
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={20} />
          <span>Weekly Sales</span>
        </div>
        <h2 className="text-2xl font-bold mt-2">₱{weeklySales.toLocaleString()}</h2>
      </div>

      {/* Daily Sales */}
      <div className="p-6 bg-white shadow rounded-2xl border border-gray-200 flex flex-col">
        <div className="flex items-center gap-2 text-gray-500">
          <Clock size={20} />
          <span>Today's Sales</span>
        </div>
        <h2 className="text-2xl font-bold mt-2">₱{dailySales.toLocaleString()}</h2>
      </div>
    </div>
    <div>
      <Analytics/>
    </div>
        </div>
  );
};

export default Dashboard;
