import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderPage from "./pages/pos/order";
import Dashboard from "./pages/dashboard/dashboard";
import Settings from "./pages/settings/addCategory";
import Menus from "./pages/menu/menus";
import Layout from "./components/sidebar/layout";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<OrderPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
           <Route path="/menu" element={<Menus />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
