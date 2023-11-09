import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./public/Login.jsx";
import Register from "./public/Register.jsx";
import JenisKamar from "./page/JenisKamar";
import Kamar from "./page/Kamar";
import Fasilitas from "./page/Fasilitas";
import Season from "./page/Season";
import Tarif from "./page/Tarif";
import Unauthorize from "./page/UnauthorizePage";
import { LandingPage } from "./page/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jenis-kamar" element={<JenisKamar />} />
        <Route path="/kamar" element={<Kamar />} />
        <Route path="/fasilitas" element={<Fasilitas />} />
        <Route path="/season" element={<Season />} />
        <Route path="/tarif" element={<Tarif />} />
        <Route path="/unauthorize" element={<Unauthorize />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
