import React, { useCallback, useEffect, useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const titleTable = [
  { name: "ID Booking", uid: "id_booking" },
  { name: "Status", uid: "status" },
  { name: "Permintaan", uid: "permintaan_khusus" },
  { name: "Check In", uid: "tgl_checkin" },
  { name: "Check Out", uid: "tgl_checkout" },
  { name: "Tanggal Reservasi", uid: "tgl_reservasi" },
  { name: "Subtotal", uid: "total_pembayaran" },
  { name: "Customer", uid: "customer" },
];

const titleTableCheckin = [
  { name: "ID Booking", uid: "id_booking" },
  { name: "Status", uid: "status" },
  { name: "Permintaan", uid: "permintaan_khusus" },
  { name: "Check In", uid: "tgl_checkin" },
  { name: "Check Out", uid: "tgl_checkout" },
  { name: "Tanggal Reservasi", uid: "tgl_reservasi" },
  { name: "Subtotal", uid: "total_pembayaran" },
  { name: "Customer", uid: "customer" },
  { name: "Actions", uid: "actions" },
];

const Pemesanan = () => {
  const [search, setSearch] = useState([]);
  const [searchCheckin, setSearchCheckin] = useState([]);

  const [primaySearch, setPrimarySearch] = useState([]);
  const [primaySearchCheckin, setPrimarySearchCheckin] = useState([]);
  const [reservasi, setReservasi] = useState([]);
  const [pemesanan, setPemesanan] = useState([]);
  const navigate = useNavigate();
  const [pickReservasi, setPickReservasi] = useState("all");

  const token = localStorage.getItem("token");
  const header = {
    Authorization: `Bearer ${token}`,
  };

  console.log(pickReservasi);

  const logout = () => {
    axios
      .post(
        `/logout`,
        {
          username: localStorage.getItem("username"),
        },
        { headers: header }
      )
      .then((res) => {
        localStorage.clear();
        alert(res.data.message);
      });
  };

  const checkin = (idReservasi) => {
    console.log(idReservasi);

    axios
      .put(
        `/checkin/${idReservasi}`,
        { uang_deposit: 300000 },
        { headers: header }
      )
      .then((res) => {
        console.log(res.data);
        alert(res.data.message);
        getPemesananCheckin();
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);

        alert(err.response.data.message);

        // if (code === 401) {
        //   navigate("/unauthorize");
        // }
      });
  };

  const getReservasi = () => {
    axios
      .get(`/pemesanan_all`, { headers: header })
      .then((res) => {
        console.log(res.data.data);
        setReservasi(res.data.data);
        setPrimarySearch(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        if (code === 401) {
          navigate("/unauthorize");
        }
      });
  };

  const getPemesananCheckin = () => {
    axios
      .get(`/pemesanan_bisa_checkin`, { headers: header })
      .then((res) => {
        console.log(res.data.data);
        setPemesanan(res.data.data);
        setPrimarySearchCheckin(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        if (code === 401) {
          navigate("/unauthorize");
        }
      });
  };

  useEffect(() => {
    getReservasi();
    getPemesananCheckin();
  }, []);

  useEffect(() => {
    if (pickReservasi === "all") {
      if (!search) {
        setPrimarySearch(reservasi);
        return;
      }

      const dataReservasi = reservasi.filter((row) => {
        return (
          row.id_booking
            .toLowerCase()
            .includes(search?.trim()?.toLowerCase()) ||
          row.status.toLowerCase().includes(search?.trim()?.toLowerCase()) ||
          row.f_k_reservasi_in_customer.nama
            .toLowerCase()
            .includes(search?.trim()?.toLowerCase())
        );
      });

      setPrimarySearch(dataReservasi);
    } else;
    {
      if (!searchCheckin) {
        setPrimarySearchCheckin(pemesanan);
        return;
      }

      const dataReservasi = pemesanan.filter((row) => {
        return (
          row.id_booking
            .toLowerCase()
            .includes(searchCheckin?.trim()?.toLowerCase()) ||
          row.status
            .toLowerCase()
            .includes(searchCheckin?.trim()?.toLowerCase()) ||
          row.f_k_reservasi_in_customer.nama
            .toLowerCase()
            .includes(searchCheckin?.trim()?.toLowerCase())
        );
      });

      setPrimarySearchCheckin(dataReservasi);
    }
  }, [search]);

  const formatRupiah = (uang) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(uang);
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { year: "numeric", month: "short", day: "numeric" };

    return date.toLocaleDateString("id-ID", options);
  };

  const buildTable = useCallback((data, columnKey) => {
    const row = data[columnKey];

    // console.log(row);

    switch (columnKey) {
      case "total_pembayaran":
        return <div>{formatRupiah(data.total_pembayaran)}</div>;
      case "tgl_checkin":
        return <div>{formatDate(data.tgl_checkin)}</div>;
      case "tgl_checkout":
        return <div>{formatDate(data.tgl_checkout)}</div>;
      case "tgl_reservasi":
        return <div>{formatDate(data.tgl_reservasi)}</div>;
      case "customer":
        return <div>{data.f_k_reservasi_in_customer.nama}</div>;

      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              onPress={() => {
                // console.log(data.id_reservasi);
                confirm(
                  `Sebelum Check In, Pastikan Menerima Deposit Rp 300.000. \nYakin ingin Check In pemesanan ${data.f_k_reservasi_in_customer.nama} dengan ID Booking ${data.id_booking}?`
                )
                  ? checkin(data.id_reservasi)
                  : null;
              }}
              content="Check In Pemesanan"
              to="#"
              variant="flat"
              color="success"
              size="sm"
            >
              Chek In
            </Button>
          </div>
        );

      default:
        return row;
    }
  }, []);

  return (
    <>
      <div>
        <Navbar position="sticky">
          <NavbarBrand>
            <p className="me-10 font-bold text-inherit">Grand Atma Hotel</p>
          </NavbarBrand>
          <NavbarContent className="sm:flex gap-12" justify="center">
            <NavbarItem isActive>
              <NavLink color="foreground" to="/pemesanan">
                Pemesanan
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink color="foreground" to="/checkin_list">
                Check In
              </NavLink>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                onPress={() => {
                  localStorage.clear();
                  logout();
                }}
                as={Link}
                color="primary"
                to="/login"
                variant="flat"
              >
                Logout
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>

        <div className="p-16">
          <div className="flex justify-end gap-4 mb-2">
            <RadioGroup
              color="secondary"
              onValueChange={setPickReservasi}
              defaultValue="all"
              orientation="horizontal"
            >
              <Radio value="all">Semua</Radio>
              <Radio value="checkin">Bisa Check In</Radio>
            </RadioGroup>

            <Input
              className="max-w-2xl"
              placeholder="Search"
              value={pickReservasi === "all" ? search : searchCheckin}
              onValueChange={
                pickReservasi === "all" ? setSearch : setSearchCheckin
              }
            />
            <Button
              onPress={() => {
                // onOpen();
                // navigate("/reservasi");
              }}
              color="primary"
              className="mb-5 float-right"
            >
              Cari
            </Button>
          </div>

          <Table>
            <TableHeader
              columns={pickReservasi === "all" ? titleTable : titleTableCheckin}
            >
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={
                pickReservasi === "all"
                  ? primaySearch
                  : primaySearchCheckin || []
              }
              emptyContent={"No rows to display."}
            >
              {(item) => (
                <TableRow key={item.id_reservasi}>
                  {(columnKey) => (
                    <TableCell>{buildTable(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default Pemesanan;
