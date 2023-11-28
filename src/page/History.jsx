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
  RadioGroup,
  Radio,
  TableRow,
  TableCell,
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
];

const History = () => {
  const [search, setSearch] = React.useState([]);
  const [primaySearch, setPrimarySearch] = React.useState([]);

  const [searchBatal, setSearchBatal] = React.useState([]);
  const [primaySearchBatal, setPrimarySearchBatal] = React.useState([]);

  const [reservasi, setReservasi] = useState([]);
  const [batalReservasi, setBatalReservasi] = useState([]);

  const navigate = useNavigate();
  const [pickReservasi, setPickReservasi] = useState("");

  const token = localStorage.getItem("token");
  const header = {
    Authorization: `Bearer ${token}`,
  };
  console.log(pickReservasi);
  const id = localStorage.getItem("id_customer");

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
      .get(`/customer/${id}`, { headers: header })
      .then((res) => {
        console.log("Kkkkkk", res.data.data.fk_customer_in_reservasi);
        setReservasi(res.data.data.fk_customer_in_reservasi);
        setPrimarySearch(res.data.data.fk_customer_in_reservasi);
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

  const getReservasiBatal = () => {
    axios
      .get(`/pembatalanCus`, { headers: header })
      .then((res) => {
        console.log(res.data.data);
        console.log("ppppp", res.data.data);
        setBatalReservasi(res.data.data);
        setPrimarySearchBatal(res.data.data);
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

  const deletebatalReservasi = (idRes) => {
    axios
      .delete(`/pembatalanCus/${idRes}`, { headers: header })
      .then((res) => {
        console.log(res.data.data);
        alert(res.data.message);
        getReservasiBatal();
        getReservasi();
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
    getReservasiBatal();
  }, []);

  useEffect(() => {
    if (pickReservasi === "all") {
      if (!search) {
        setPrimarySearch(reservasi);
        return;
      }

      const dataReservasi = reservasi.filter((row) => {
        return (
          row?.id_booking
            ?.toLowerCase()
            .includes(search?.trim()?.toLowerCase()) ||
          row.status.toLowerCase().includes(search?.trim()?.toLowerCase())
        );
      });

      setPrimarySearch(dataReservasi);
    } else {
      if (!searchBatal) {
        setPrimarySearchBatal(batalReservasi);
        return;
      }

      const dataReservasi = batalReservasi.filter((row) => {
        return (
          row.id_booking
            .toLowerCase()
            .includes(search?.trim()?.toLowerCase()) ||
          row.status.toLowerCase().includes(search?.trim()?.toLowerCase())
        );
      });

      setPrimarySearch(dataReservasi);
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

    console.log(row);

    switch (columnKey) {
      case "id_booking":
        return <div>{data.id_booking}</div>;
      case "status":
        return <div>{data.status}</div>;
      case "permintaan_khusus":
        return <div>{data.permintaan_khusus}</div>;

      case "total_pembayaran":
        return <div>{formatRupiah(data.total_pembayaran)}</div>;
      case "tgl_checkin":
        return <div>{formatDate(data.tgl_checkin)}</div>;
      case "tgl_checkout":
        return <div>{formatDate(data.tgl_checkout)}</div>;
      case "tgl_reservasi":
        return <div>{formatDate(data.tgl_reservasi)}</div>;

      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              onPress={() =>
                confirm(
                  `Apakah anda yakin membatalkan reservasi ${data.id_booking}?`
                )
                  ? deletebatalReservasi(data.id_reservasi)
                  : null
              }
              content="delete season"
              to="#"
              color="danger"
              variant="light"
              size="sm"
            >
              Batal
            </Button>
          </div>
        );

      default:
        return row;
    }
  }, []);

  return (
    <div>
      <Navbar position="sticky">
        <NavbarBrand>
          <p className=" font-bold text-inherit">Grand Atma Hotel</p>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-14" justify="center">
          <NavbarItem>
            <NavLink color="foreground" to="/home">
              Home
            </NavLink>
          </NavbarItem>
          <NavbarItem isActive>
            <NavLink to="/history">History</NavLink>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              onPress={() => {
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
            <Radio value="batal">Bisa dibatalkan</Radio>
          </RadioGroup>

          <Input
            className="max-w-2xl"
            placeholder="Search"
            value={pickReservasi === "all" ? search : searchBatal}
            onValueChange={pickReservasi === "all" ? setSearch : setSearchBatal}
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
            columns={pickReservasi === "batal" ? titleTable : titleTableBatal}
          >
            {(column) => (
              <TableColumn key={column.uid}>{column.name}</TableColumn>
            )}
          </TableHeader>

          <TableBody
            items={
              pickReservasi === "all" ? primaySearch : primaySearchBatal || []
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
  );
};

export default History;
