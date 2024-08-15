import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "../views/LogIn/LogIn";
import Register from "../views/Register/Register";
import Dashboard from "../views/Dashboard/Dashboard";
import FormAdminUser from "../views/FormAdminUser/FormAdminUser";
import FormAddProject from "../views/FormAddProject/FormAddProject";
import DetallesProyecto from "../views/DetallesProyecto/DetallesProyecto";
import FormAddBoard from "../views/FormAddBoard/FormAddBoard";
import KanbanBoard from "../views/KanbanBoard/KanbanBoard";

function App() {
  const URL = import.meta.env.VITE_API_URL;
  return (
    <div className="App">
      <Routes>
        <Route path="/register" element={<Register URL={URL} />} />
        <Route path="/" element={<LogIn URL={URL} />} />
        <Route path="/dashboard" element={<Dashboard URL={URL} />} />
        <Route path="/admin/:idProject" element={<FormAdminUser URL={URL} />} />
        <Route path="/proyecto/new" element={<FormAddProject URL={URL} />} />
        <Route path="/detalles/:idProject" element={<DetallesProyecto URL={URL} />} />
        <Route path="/detalles/:idProject/newboard" element={<FormAddBoard URL={URL} />} />
        <Route path="/detalles/:idProject/:idBoard" element={<KanbanBoard URL={URL} />} />
      </Routes>
    </div>
  );
}

export default App;