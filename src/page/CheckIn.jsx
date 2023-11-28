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

const CheckIn = () => {
  const [search, setSearch] = useState([]);
  const [primaySearch, setPrimarySearch] = useState([]);

  const [checkin, setCheckin] = useState([]);
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [idBooking, setIdBooking] = useState("");
  const [idReservasi, setIdReservasi] = useState("");
  const [layanan, setLayanan] = React.useState([]);
  const [pilihLayanan, setPilihLayanan] = React.useState([
    { id_layanan: "", jumlah: "" },
  ]);

  const token = localStorage.getItem("token");
  const header = {
    Authorization: `Bearer ${token}`,
  };

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

  const addFasilitas = (idReservasi) => {
    axios
      .post(
        `/add_fasilitas_fo/${idReservasi}`,
        { fasilitas: pilihLayanan },
        { headers: header }
      )
      .then((res) => {
        console.log(res.data.data);
        onOpenChange(false);
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const getCheckin = () => {
    axios
      .get("/pemesanan_sedang_checkin", { headers: header })
      .then((res) => {
        console.log(res.data.data);
        setCheckin(res.data.data);
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

  useEffect(() => {
    getCheckin();
    getFasilitas();
  }, []);

  const handleInputChange = (index, fieldName, value) => {
    const values = [...pilihLayanan];
    values[index][fieldName] = value;
    setPilihLayanan(values);
  };

  const handleAddRow = () => {
    setPilihLayanan([...pilihLayanan, { id_layanan: "", jumlah: "" }]);
  };

  useEffect(() => {
    if (!search) {
      setPrimarySearch(checkin);
      return;
    }

    const dataReservasi = checkin.filter((row) => {
      return (
        row.id_booking.toLowerCase().includes(search?.trim()?.toLowerCase()) ||
        row.status.toLowerCase().includes(search?.trim()?.toLowerCase()) ||
        row.f_k_reservasi_in_customer.nama
          .toLowerCase()
          .includes(search?.trim()?.toLowerCase())
      );
    });

    setPrimarySearch(dataReservasi);
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
                localStorage.setItem("id_reservasi", data.id_reservasi);
                localStorage.setItem("id_booking", data.id_booking);

                localStorage.setItem("tgl_checkin_fo", data.tgl_checkin);
                localStorage.setItem("tgl_checkout_fo", data.tgl_checkout);
                navigate("/checkout");
              }}
              content="Check In Pemesanan"
              to="#"
              variant="flat"
              color="primary"
              size="sm"
            >
              Check Out
            </Button>

            <Button
              onPress={() => {
                setIdBooking(data.id_booking);
                setIdReservasi(data.id_reservasi);
                setPilihLayanan([{ id_layanan: "", jumlah: "" }]);
                onOpen();
              }}
              content="Check In Pemesanan"
              to="#"
              variant="flat"
              color="success"
              size="sm"
            >
              Add Fasilitas
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
              <NavLink color="foreground" to="/pemesanan">
                Pemesanan
              </NavLink>
            </NavbarItem>
            <NavbarItem isActive>
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
            <Input
              className="max-w-2xl"
              placeholder="Search"
              value={search}
              onValueChange={setSearch}
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
            <TableHeader columns={titleTable}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={primaySearch || []}
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

      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onclose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Fasilitas Pada ID Booking {idBooking}
              </ModalHeader>

              <ModalBody>
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
                <Button className="w-xs" onClick={handleAddRow}>
                  Tambah Fasilitas
                </Button>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onclose}>
                  Tutup
                </Button>

                <Button
                  color="primary"
                  onPress={() => {
                    confirm(
                      "Apakah anda yakin ingin menambahkan fasilitas ini?"
                    )
                      ? addFasilitas(idReservasi)
                      : onOpenChange(false);
                  }}
                >
                  Simpan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckIn;
