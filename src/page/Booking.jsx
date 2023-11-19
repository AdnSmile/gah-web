import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  Select,
  Input,
  Card,
  CardHeader,
  CardBody,
  SelectItem,
} from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const [layanan, setLayanan] = React.useState([]);
  const [pilihLayanan, setPilihLayanan] = React.useState([
    { id_layanan: "", jumlah: "" },
  ]);
  const [dewasa, setDewasa] = React.useState(0);
  const [anak, setAnak] = React.useState(0);
  const [permintaan, setPermintaan] = React.useState("");
  const [tglCheckIn, setTglCheckIn] = React.useState("");
  const [tglCheckOut, setTglCheckOut] = React.useState("");
  const [pilihKamar, setPilihKamar] = React.useState([
    { id_jenis_kamar: "", jumlah: "", harga_per_malam: "" },
  ]);
  const [kamar, setKamar] = React.useState([]);
  const [maxKamar, setMaxKamar] = React.useState(0);
  const [idJenisKamar, setIdJenisKamar] = React.useState("");
  const navigate = useNavigate();

  const [customer, setCustomer] = useState([]);
  const [idCustomer, setIdCustomer] = useState("");

  const token = localStorage.getItem("token");
  const header = {
    Authorization: `Bearer ${token}`,
  };

  console.log("Max Kamar : ", maxKamar);
  const role = localStorage.getItem("role");

  // localStorage.removeItem("id_reservasi");

  useEffect(() => {
    const dataKamar = JSON.parse(localStorage.getItem("data_kamar"));
    if (dataKamar) {
      setKamar(dataKamar);
      setDewasa(localStorage.getItem("jumlah_dewasa"));
      setAnak(localStorage.getItem("jumlah_anak"));
      setTglCheckIn(localStorage.getItem("tanggal_checkin"));
      setTglCheckOut(localStorage.getItem("tanggal_checkout"));
    }
  }, []);

  console.log("Kamar : ", kamar);

  const getFasilitas = () => {
    axios
      .get("/fasilitas", { headers: header })
      .then((res) => {
        console.log(res.data.data);

        setLayanan(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        // if (code == 403 || code == 401) navigate("/unauthorize");
      });
  };

  const getCustomer = () => {
    axios
      .get("/customerGrup", { headers: header })
      .then((res) => {
        console.log(res.data.data);
        setCustomer(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        // if (code == 403 || code == 401) navigate("/unauthorize");
      });
  };

  const postBooking = (id) => {
    console.log("Pilih Kamar: ", JSON.stringify(pilihKamar));
    console.log("Pilih Fasilitas: ", JSON.stringify(pilihLayanan));
    const idCustomer = [...id];
    console.log("Id Customer : ", idCustomer[0]);
    axios
      .post(
        `/newReservasiSm/${idCustomer[0]}`,
        {
          jumlah_dewasa: dewasa,
          jumlah_anak: anak,
          tgl_checkin: tglCheckIn,
          tgl_checkout: tglCheckOut,
          permintaan_khusus: permintaan.toString(),
          kamar: pilihKamar,
          fasilitas: pilihLayanan,
        },
        { headers: header }
      )
      .then((res) => {
        console.log(res.data.data);
        localStorage.setItem("id_reservasi", res.data.data.id_reservasi);
        console.log("id reservasi: ", localStorage.getItem("id_reservasi"));
        alert(res.data.message);
        navigate("/resume");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const postBookingCustomer = (id) => {
    console.log("Pilih Kamar: ", JSON.stringify(pilihKamar));
    console.log("Pilih Fasilitas: ", JSON.stringify(pilihLayanan));
    const idCustomer = [...id];
    console.log("Id Customer : ", idCustomer[0]);

    axios
      .post(
        `/newReservasiCus/${idCustomer[0]}`,
        {
          jumlah_dewasa: dewasa,
          jumlah_anak: anak,
          tgl_checkin: tglCheckIn,
          tgl_checkout: tglCheckOut,
          permintaan_khusus: permintaan,
          kamar: pilihKamar,
          fasilitas: pilihLayanan,
        },
        { headers: header }
      )
      .then((res) => {
        console.log(res.data.data);
        localStorage.setItem("id_reservasi", res.data.data.id_reservasi);
        console.log("id reservasi: ", localStorage.getItem("id_reservasi"));
        alert(res.data.message);
        navigate("/resume");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  console.log("Id customer: ", idCustomer);

  useEffect(() => {
    getFasilitas();
  }, []);

  useEffect(() => {
    getCustomer();
  }, []);

  console.log("id Jenis Kamar: ", idJenisKamar);

  const handleInputChange = (index, fieldName, value) => {
    const values = [...pilihLayanan];
    values[index][fieldName] = value;
    setPilihLayanan(values);
  };

  const handleAddRow = () => {
    setPilihLayanan([...pilihLayanan, { id_layanan: "", jumlah: "" }]);
  };

  const handleInputChangeKamar = (index, fieldName, value) => {
    const values = [...pilihKamar];
    values[index][fieldName] = value;
    setPilihKamar(values);

    if (fieldName === "id_jenis_kamar") {
      values[index]["harga_per_malam"] = getHargaTerbaru(value);
      setPilihKamar(values);
    }
  };

  const handleAddKamar = () => {
    setPilihKamar([
      ...pilihKamar,
      { id_jenis_kamar: "", jumlah: "", harga_per_malam: "" },
    ]);
  };

  const formatRupiah = (uang) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(uang);
  };

  const getHargaTerbaru = (id) => {
    const data = kamar.find((item) => item.id_jenis_kamar == id);
    // console.log("Data : ", data.harga_terbaru);

    return data ? data.harga_terbaru : 0;
  };

  const getMaxKamar = (id) => {
    const data = kamar.find((item) => item.id_jenis_kamar == id);
    // console.log("Data : ", data.harga_terbaru);

    return data ? data.jumlah_kamar : 0;
  };

  return (
    <div className="flex justify-center items-center gap-4">
      <Card className="">
        <CardHeader className="flex flex-col gap-1 text-xl">Booking</CardHeader>
        <CardBody className="gap-4">
          {role == "sm" && (
            <div>
              <h1>Pilih Customer yang akan reservasi</h1>
              <Select
                items={customer || []}
                type="text"
                label="Customer"
                selectedKeys={idCustomer}
                onSelectionChange={setIdCustomer}
              >
                {(temp) => (
                  <SelectItem key={temp.id_customer}>{temp.nama}</SelectItem>
                )}
              </Select>
            </div>
          )}

          <h1>Pilih banyak kamar</h1>

          {pilihKamar.map((data, index) => (
            <div key={index} className="flex justify-end gap-4 mb-2">
              <Select
                items={kamar || []}
                type="text"
                label="Jenis Kamar"
                selectedKeys={data.id_jenis_kamar}
                onChange={(e) => {
                  handleInputChangeKamar(
                    index,
                    "id_jenis_kamar",
                    e.target.value
                  );
                  setIdJenisKamar(e.target.value);
                }}
              >
                {(temp) => (
                  <SelectItem key={temp.id_jenis_kamar}>
                    {temp.jenis_kamar}
                  </SelectItem>
                )}
              </Select>

              <Input
                type="text"
                label="Harga"
                value={formatRupiah(getHargaTerbaru(data.id_jenis_kamar))}
                onChange={(e) =>
                  handleInputChangeKamar(
                    index,
                    "harga_per_malam",
                    e.target.value
                  )
                }
              />

              <Input
                max={getMaxKamar(idJenisKamar)}
                type="number"
                label="Jumlah"
                value={data.jumlah}
                onChange={(e) =>
                  handleInputChangeKamar(index, "jumlah", e.target.value)
                }
              />
            </div>
          ))}
          <Button className="max-w-xs" onClick={handleAddKamar}>
            Tambah Kamar
          </Button>

          <h1>Pilih Fasilitas</h1>
          {pilihLayanan.map((data, index) => (
            <div key={index} className="flex gap-2">
              <Select
                items={layanan || []}
                type="text"
                label="Fasilitas"
                selectedKeys={data.id_layanan}
                onChange={(e) =>
                  handleInputChange(index, "id_layanan", e.target.value)
                }
              >
                {(temp) => (
                  <SelectItem key={temp.id_layanan}>
                    {temp.nama_layanan}
                  </SelectItem>
                )}
              </Select>

              <Input
                type="number"
                label="Jumlah"
                value={data.jumlah}
                onChange={(e) =>
                  handleInputChange(index, "jumlah", e.target.value)
                }
              />
            </div>
          ))}
          <Button className="max-w-xs" onClick={handleAddRow}>
            Tambah Fasilitas
          </Button>

          <h1>Masukan Permintaan Khusus</h1>
          <Input
            value={permintaan}
            onValueChange={setPermintaan}
            type="textarea"
            label="Permintaan Khusus"
          />

          <Button
            onPress={() => {
              confirm("Apakah yakin akan reservasi?")
                ? role == "sm"
                  ? postBooking(idCustomer)
                  : postBookingCustomer(localStorage.getItem("id_customer"))
                : null;
            }}
          >
            Tambah Reservasi
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Booking;
