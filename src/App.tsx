import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* index - этот элемент откроется по умолчанию на пути '/' */}
        <Route index element={<Dashboard />} />

        {/* временные заглушки для других страниц */}
        <Route path="/history" element={<History />} />
        <Route path="/bonuses" element={<div className="p-5 text-center mt-10">История бонусов будет</div>} />
        <Route path="/profile" element={<div className="p-5 text-center mt-10">Привязка клиента будет</div>} />
      </Route>
    </Routes>
  );
}

export default App