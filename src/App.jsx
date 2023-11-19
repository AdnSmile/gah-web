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
import Home from "./page/Home.jsx";
import History from "./page/History.jsx";
import Customer from "./page/Customer.jsx";
import Reservasi from "./page/Reservasi.jsx";
import Booking from "./page/Booking.jsx";
import Resume from "./page/Resume.jsx";
import Pembayaran from "./page/Pembayaran.jsx";
import UangMuka from "./page/UangMuka.jsx";

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
        <Route path="/home" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/reservasi" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/pembayaran" element={<Pembayaran />} />
        <Route path="/reservasi_history" element={<Reservasi />} />
        <Route path="/uang_muka" element={<UangMuka />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
