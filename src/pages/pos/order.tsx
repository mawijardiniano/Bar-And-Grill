import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  addItem,
  increaseQty,
  decreaseQty,
  clearOrder,
} from "../../redux/orderSlice";
import { fetchMenu } from "../../redux/menuSlice";
import { useEffect, useState } from "react";
import axios from "axios";

const Order = () => {
  const dispatch = useDispatch();
  const menu = useSelector((state: RootState) => state.menu.items);
  const order = useSelector((state: RootState) => state.order);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(2); 
      } else {
        setItemsPerPage(null); 
      }
      setPage(1);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchMenu() as any);
  }, [dispatch]);

  const total = order.items.reduce(
    (sum, item) => sum + item.menu_id.menu_price * item.quantity,
    0
  );

  const handleSubmitOrder = async () => {
    if (order.items.length === 0) return;

    const newOrder = {
      items: order.items.map((i) => ({
        menu_id: i.menu_id._id,
        quantity: i.quantity,
      })),
      total_price: total,
    };

    try {
      const res = await axios.post("https://bar-and-grill.onrender.com/api/order", newOrder);

      console.log("✅ Order saved:", res.data);
      dispatch(clearOrder());
      alert("Order submitted successfully!");
    } catch (err) {
      console.error("❌ Submit failed:", err);
      alert("Failed to submit order. Try again.");
    }
  };

  const activeMenu = menu.filter((m) => m.is_active === true);

  const filteredMenu = activeMenu.filter((m) => {
    const matchesSearch = m.menu_name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      m.menu_type?.menu_type_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...new Set(
      activeMenu
        .map((m) => m.menu_type?.menu_type_name)
        .filter((c) => c !== undefined && c !== null)
    ),
  ];

  // pagination logic
  const totalPages = itemsPerPage
    ? Math.ceil(filteredMenu.length / itemsPerPage)
    : 1;

  const visibleMenu = itemsPerPage
    ? filteredMenu.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    : filteredMenu; // show all if no pagination

  return (
    <div className="flex flex-col items-start lg:flex-row gap-6">
      <div className="flex-1">
        {/* Search + Filter */}
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="text"
            placeholder="Search menu..."
            className="flex-1 p-2 border rounded"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="p-2 border rounded"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {visibleMenu.map((m) => (
            <div key={m._id} className="h-32 p-4 border rounded shadow">
              <h2 className="font-semibold">{m.menu_name}</h2>
              <p className="text-gray-600">₱{m.menu_price}</p>
              <button
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded max-sm:text-xs max-sm:px-2 max-sm:py-2"
                onClick={() => dispatch(addItem(m))}
              >
                Add to Order
              </button>
            </div>
          ))}
          {filteredMenu.length === 0 && (
            <p className="col-span-full text-gray-500">No menu items found.</p>
          )}
        </div>
        {itemsPerPage && totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Right Section: Current Orders */}
      <div className="lg:w-1/3 w-full p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Current Orders</h2>

        {order.items.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li
                key={item.menu_id._id}
                className="flex justify-between items-center"
              >
                <div>
                  <span className="font-medium">{item.menu_id.menu_name}</span>
                  <p className="text-sm text-gray-500">
                    ₱{item.menu_id.menu_price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => dispatch(decreaseQty(item.menu_id._id))}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 border rounded"
                    onClick={() => dispatch(increaseQty(item.menu_id._id))}
                  >
                    +
                  </button>
                </div>

                <span className="ml-4">
                  ₱{(item.menu_id.menu_price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}

        <hr className="my-3" />
        <p className="font-bold text-lg flex justify-between">
          <span>Total:</span>
          <span>₱{total.toFixed(2)}</span>
        </p>

        {order.items.length > 0 && (
          <button
            onClick={handleSubmitOrder}
            className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Order
          </button>
        )}
      </div>
    </div>
  );
};

export default Order;
