import { useCallback, useState } from "react";

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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const titleTable = [
  { name: "Jenis Kamar", uid: "jenis_kamar" },
  { name: "Jumlah Kamar Tersedia", uid: "jumlah_kamar" },
  { name: "Tarif", uid: "tarif" },
  { name: "Tipe Bed", uid: "tipe_bed" },
  { name: "Ukuran Kamar", uid: "ukuran_kamar" },
  { name: "Actions", uid: "actions" },
];

const Home = () => {
  const { isOpen, onOpenChange } = useDisclosure();
  const [tglCheckIn, setTglCheckIn] = useState("");
  const [tglCheckOut, setTglCheckOut] = useState("");
  const [dewasa, setDewasa] = useState(0);
  const [anak, setAnak] = useState(0);
  const [kamar, setKamar] = useState([]);
  const navigate = useNavigate();

  const [hargaBaru, setHargaBaru] = useState(0);
  const [deskripsiKamar, setDeskripsiKamar] = useState("");
  const [namaKamar, setNamaKamar] = useState("");
  const [rincian, setRincian] = useState("");
  const [tipeBed, setTipeBed] = useState("");
  const [ukuranKamar, setUkuranKamar] = useState("");

  const arrayRincian = rincian.split(",");
  const arrayDeskripsi = deskripsiKamar.split(".");

  const token = localStorage.getItem("token");
  const header = {
    Authorization: `Bearer ${token}`,
  };

  localStorage.setItem("tanggal_checkin", tglCheckIn);
  localStorage.setItem("tanggal_checkout", tglCheckOut);
  localStorage.setItem("jumlah_dewasa", dewasa);
  localStorage.setItem("jumlah_anak", anak);

  const role = localStorage.getItem("role");

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

  const checkKamar = () => {
    axios
      .post(
        `/ketersediianKamar`,
        {
          tgl_checkin: tglCheckIn,
          tgl_checkout: tglCheckOut,
          jumlah_dewasa: dewasa,
          jumlah_anak: anak,
        },
        { headers: header }
      )
      .then((res) => {
        console.log(res.data.data);

        setKamar(res.data.data);

        localStorage.setItem("data_kamar", JSON.stringify(res.data.data));
      })
      .catch((err) => {
        console.log(dewasa);
        console.log(err);
      });
  };

  const detailKamar = (item) => {
    console.log(item);
    setHargaBaru(item.harga_terbaru);
    setDeskripsiKamar(item.f_k_kamar_in_jenis_kamar.deskripsi);
    setNamaKamar(item.f_k_kamar_in_jenis_kamar.nama);
    setRincian(item.f_k_kamar_in_jenis_kamar.rincian_kamar);
    setTipeBed(item.f_k_kamar_in_jenis_kamar.tipe_bed);
    setUkuranKamar(item.f_k_kamar_in_jenis_kamar.ukuran_kamar);
    console.log(namaKamar);
    onOpenChange(true);
  };

  const formatRupiah = (uang) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(uang);
  };

  const buildTable = useCallback((data, columnKey) => {
    const row = data[columnKey];

    console.log(row);

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              onPress={() => {
                detailKamar(data);
              }}
              content="Show detail kamar"
              color="primary"
              to="#"
              variant="flat"
            >
              Show
            </Button>
            <Button
              onPress={() => {
                navigate("/booking");
              }}
              content="Booking"
              color="primary"
              to="/booking"
              variant="flat"
            >
              Booking
            </Button>
          </div>
        );

      case "tarif":
        return <div>{formatRupiah(data.harga_terbaru)}</div>;

      case "tipe_bed":
        return <div>{data.f_k_kamar_in_jenis_kamar.tipe_bed}</div>;

      case "ukuran_kamar":
        return <div>{data.f_k_kamar_in_jenis_kamar.ukuran_kamar}</div>;

      default:
        return row;
    }
  }, []);

  return (
    <>
      <div>
        <Navbar position="static">
          <NavbarBrand>
            <p className="me-10 font-bold text-inherit">Grand Atma Hotel</p>
          </NavbarBrand>
          <NavbarContent className="sm:flex gap-12" justify="center">
            {role == "customer" && (
              <NavbarItem isActive>
                <NavLink color="foreground" to="/home">
                  Home
                </NavLink>
              </NavbarItem>
            )}
            {role == "sm" && (
              <NavbarItem>
                <NavLink color="foreground" to="/customer">
                  Customer
                </NavLink>
              </NavbarItem>
            )}
            {role == "sm" && (
              <NavbarItem isActive>
                <NavLink color="foreground" to="/home">
                  Booking
                </NavLink>
              </NavbarItem>
            )}
            {role == "sm" && (
              <NavbarItem>
                <NavLink color="foreground" to="/reservasi_history">
                  Reservasi
                </NavLink>
              </NavbarItem>
            )}
            {role == "sm" && (
              <NavbarItem>
                <NavLink color="foreground" to="/uang_muka">
                  Uang Muka
                </NavLink>
              </NavbarItem>
            )}
            {role == "sm" && (
              <NavbarItem>
                <NavLink color="foreground" to="/season">
                  Season
                </NavLink>
              </NavbarItem>
            )}
            {role == "sm" && (
              <NavbarItem>
                <NavLink color="foreground" to="/fasilitas">
                  Fasilitas
                </NavLink>
              </NavbarItem>
            )}
            {role == "sm" && (
              <NavbarItem>
                <NavLink to="/tarif">Tarif</NavLink>
              </NavbarItem>
            )}
            {role == "customer" && (
              <NavbarItem>
                <NavLink to="/history">History</NavLink>
              </NavbarItem>
            )}
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
          <div className="flex justify-col gap-4 mb-2">
            <Input
              value={tglCheckIn}
              onValueChange={setTglCheckIn}
              className="max-w-2xl"
              label="Tanggal Check In"
              labelPlacement="outside"
              type="date"
            />
            <Input
              className="max-w-2xl"
              label="Tanggal Check Out"
              labelPlacement="outside"
              type="date"
              value={tglCheckOut}
              onValueChange={setTglCheckOut}
            />
            <Input
              className="max-w-2xl"
              label="Jumlah Dewasa"
              labelPlacement="outside"
              type="number"
              value={dewasa}
              onValueChange={setDewasa}
            />
            <Input
              className="max-w-2xl"
              label="Jumlah Anak"
              labelPlacement="outside"
              type="number"
              value={anak}
              onValueChange={setAnak}
            />
            {/* <Input
              className="max-w-2xl"
              label="Jumlah Kamar"
              labelPlacement="outside"
              type="number"
              value={jumlahKamar}
              onValueChange={setJumlahKamar}
            /> */}
            <Button
              onPress={() => {
                checkKamar();
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
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={kamar || []} emptyContent={"No rows to display."}>
              {(item) => (
                <TableRow key={item.id_jenis_kamar}>
                  {(columnKey) => (
                    <TableCell>{buildTable(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Modal
        placement="center"
        size="4xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {namaKamar}
              </ModalHeader>

              <ModalBody>
                <p className="text-xl">{formatRupiah(hargaBaru)}</p>
                <br />
                <p>Tipe Bed: {tipeBed}</p>
                <p>Ukuran Kamar: {ukuranKamar}</p>
                {arrayDeskripsi.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
                <br />
                <p>Rincian kamar:</p>
                {arrayRincian.map((item, index) => (
                  <p className="ml-8" key={index}>
                    {item}
                  </p>
                ))}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
