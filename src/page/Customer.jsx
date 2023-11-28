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
  { name: "Nama", uid: "nama" },
  { name: "Email", uid: "email" },
  { name: "Alamat", uid: "alamat" },
  { name: "Institusi", uid: "institusi" },
  { name: "Nomor Telpon", uid: "no_telpon" },
  { name: "Nomor Identitas", uid: "no_identitas" },
];

const Customer = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [customer, setCustomer] = useState([]);
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [alamat, setAlamat] = useState("");
  const [institusi, setInstitusi] = useState("");
  const [noTelp, setNoTelp] = useState("");
  const [identitas, setIdentitas] = useState("");
  const [search, setSearch] = React.useState([]);
  const [primaySearch, setPrimarySearch] = React.useState([]);
  const navigate = useNavigate();

  console.log(localStorage.getItem("token"));

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

  const getCustomer = () => {
    axios
      .get("/customer", { headers: header })
      .then((res) => {
        console.log(res.data.data);
        setCustomer(res.data.data);
        setPrimarySearch(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        if (code == 403 || code == 401) navigate("/unauthorize");
      });
  };

  useEffect(() => {
    getCustomer();
  }, []);

  useEffect(() => {
    if (!search) {
      setPrimarySearch(customer);
      return;
    }

    const dataFasilitas = customer.filter((row) => {
      return (
        row.nama.toLowerCase().includes(search?.trim()?.toLowerCase()) ||
        // row.institusi.toLowerCase().includes(search?.trim()?.toLowerCase()) ||
        row.email.toLowerCase().includes(search?.trim()?.toLowerCase()) ||
        row.no_identitas.toLowerCase().includes(search?.trim()?.toLowerCase())
      );
    });

    setPrimarySearch(dataFasilitas);
  }, [search]);

  const addCustomer = () => {
    axios
      .post(
        "/customer",
        {
          nama: nama,
          email: email,
          alamat: alamat,
          institusi: institusi,
          no_telpon: noTelp,
          no_identitas: identitas,
        },
        { headers: header }
      )
      .then((res) => {
        getCustomer();
        onOpenChange(false);
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const buildTable = useCallback((data, columnKey) => {
    const row = data[columnKey];

    console.log(row);

    switch (columnKey) {
      case "institusi":
        if (data.institusi != null) return data.institusi;
        else return <div>Non Instansi</div>;
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
            <NavbarItem isActive>
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
            <NavbarItem>
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
            <Input
              className="max-w-2xl"
              placeholder="Search"
              value={search}
              onValueChange={setSearch}
            />
            <Button
              onPress={() => {
                setNama("");
                setEmail("");
                setAlamat("");
                setInstitusi("");
                setIdentitas("");
                setNoTelp("");
                onOpen();
              }}
              color="primary"
              className="mb-5 float-right"
            >
              Daftar Customer
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
                <TableRow key={item.id_customer}>
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
                Isi Data Customer
              </ModalHeader>

              <ModalBody>
                <h1 className="ml-2">Nama</h1>
                <Input value={nama} onValueChange={setNama} type="text" />

                <h1 className="ml-2">Email</h1>
                <Input value={email} onValueChange={setEmail} type="text" />

                <h1 className="ml-2">Alamat</h1>
                <Input value={alamat} onValueChange={setAlamat} type="text" />

                <h1 className="ml-2">Institusi</h1>
                <Input
                  value={institusi}
                  onValueChange={setInstitusi}
                  type="text"
                />

                <h1 className="ml-2">Nomor Telpon</h1>
                <Input value={noTelp} onValueChange={setNoTelp} type="text" />

                <h1 className="ml-2">Nomor Identitas</h1>
                <Input
                  value={identitas}
                  onValueChange={setIdentitas}
                  type="text"
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onclose}>
                  Tutup
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    confirm("Apakah anda yakin ingin menambah customer ini?")
                      ? addCustomer()
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

export default Customer;
