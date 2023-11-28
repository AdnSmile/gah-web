import React, { useCallback, useEffect, useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Select,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  SelectItem,
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
  { name: "Actions", uid: "actions" },
];

const titleTableBatal = [
  { name: "ID Booking", uid: "id_booking" },
  { name: "Status", uid: "status" },
  { name: "Permintaan", uid: "permintaan_khusus" },
  { name: "Check In", uid: "tgl_checkin" },
  { name: "Check Out", uid: "tgl_checkout" },
  { name: "Tanggal Reservasi", uid: "tgl_reservasi" },
  { name: "Subtotal", uid: "total_pembayaran" },
  { name: "Customer", uid: "customer" },
];

const UangMuka = () => {
  const [search, setSearch] = React.useState([]);
  const [searchBelum, setSearchBelum] = React.useState([]);
  const [primaySearch, setPrimarySearch] = React.useState([]);
  const [primaySearchBelum, setPrimarySearchBelum] = React.useState([]);
  const navigate = useNavigate();
  const [pickReservasi, setPickReservasi] = useState("all");

  const [reservasi, setReservasi] = useState([]);
  const [reservasiBelum, setReservasiBelum] = useState([]);

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

  const getReservasi = () => {
    axios
      .get(`/all_reservasi`, { headers: header })
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

  const getReservasiBelum = () => {
    axios
      .get(`/reservasi_bb`, { headers: header })
      .then((res) => {
        console.log(res.data.data);
        setReservasiBelum(res.data.data);
        setPrimarySearchBelum(res.data.data);
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
    getReservasiBelum();
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
    } else {
      if (!searchBelum) {
        setPrimarySearchBelum(reservasiBelum);
        return;
      }

      const dataReservasi = reservasiBelum.filter((row) => {
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

      setPrimarySearchBelum(dataReservasi);
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
                localStorage.setItem("total_bayar", data.total_pembayaran);

                localStorage.setItem("id_reservasi", data.id_reservasi);
                navigate("/pembayaran");
              }}
              content="Bayar Uang Muka"
              to="#"
              variant="flat"
              color="success"
              size="sm"
            >
              Bayar
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
            <NavbarItem>
              <NavLink color="foreground" to="/customer">
                Customer
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink color="foreground" to="/reservasi">
                Booking
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink color="foreground" to="/reservasi_history">
                Reservasi
              </NavLink>
            </NavbarItem>
            <NavbarItem isActive>
              <NavLink color="foreground" to="/uang_muka">
                Uang Muka
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink color="foreground" to="/season">
                Season
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink color="foreground" to="/fasilitas">
                Fasilitas
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/tarif">Tarif</NavLink>
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
              <Radio value="belum">Belum membayar</Radio>
            </RadioGroup>

            <Input
              className="max-w-2xl"
              placeholder="Search"
              value={pickReservasi === "all" ? search : searchBelum}
              onValueChange={
                pickReservasi === "all" ? setSearch : setSearchBelum
              }
            />
            <Button
              onPress={() => {
                // onOpen();
                navigate("/reservasi");
              }}
              color="primary"
              className="mb-5 float-right"
            >
              Tambah Reservasi
            </Button>
          </div>

          <Table>
            <TableHeader
              columns={pickReservasi === "belum" ? titleTable : titleTableBatal}
            >
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={
                pickReservasi === "all" ? primaySearch : primaySearchBelum || []
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

export default UangMuka;
