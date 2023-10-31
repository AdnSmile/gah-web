import React, { useCallback, useEffect } from "react";

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
  { name: "Jenis Kamar", uid: "jenis_kamar" },
  { name: "Nomor Kamar", uid: "id_kamar" },
  { name: "Luas Kamar", uid: "luas_kamar" },
  { name: "Actions", uid: "actions" },
];

const header = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

const Kamar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [kamar, setKamar] = React.useState([]);
  const [jenisKamar, setJenisKamar] = React.useState("");
  const [tempJenisKamar, setTempJenisKamar] = React.useState([]);
  const [noKamar, setNoKamar] = React.useState("");
  const [idKamar, setIdKamar] = React.useState("");
  const [search, setSearch] = React.useState([]);
  const [primaySearch, setPrimarySearch] = React.useState([]);
  const navigate = useNavigate();

  console.log(localStorage.getItem("token"));

  const getKamar = () => {
    axios
      .get("/kamar", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);

        setKamar(res.data.data);
        setPrimarySearch(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        if (code == 403 || code == 401) navigate("/unauthorize");
        // alert(err.response.data.message);
      });
  };

  const getJenisKamar = () => {
    axios
      .get("/jenisKamar")
      .then((res) => {
        setTempJenisKamar(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  useEffect(() => {
    getKamar();
  }, []);

  useEffect(() => {
    getJenisKamar();
  }, []);

  useEffect(() => {
    if (!search) {
      setPrimarySearch(kamar);
      return;
    }

    const dataKamar = kamar.filter((row) => {
      return (
        row.f_k_kamar_in_jenis_kamar.nama
          .toLowerCase()
          .includes(search?.trim()?.toLowerCase()) ||
        row.id_kamar
          ?.toString()
          .toLowerCase()
          .includes(search?.trim()?.toLowerCase()) ||
        row.f_k_kamar_in_jenis_kamar.ukuran_kamar
          .toString()
          .includes(search?.trim()?.toLowerCase())
      );
    });

    setPrimarySearch(dataKamar);
  }, [search]);

  const onUpdate = (kamar) => {
    setIdKamar(kamar.id_kamar);
    setNoKamar(kamar.id_kamar);
    setJenisKamar(new Set([kamar.id_jenis_kamar.toString()]));
    onOpenChange(true);
  };

  const onDelete = (id) => {
    axios
      .delete(`/kamar/${id}`, { headers: header })
      .then((res) => {
        getKamar();
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const addKamar = () => {
    const jenisKamarName = [...jenisKamar];

    axios
      .post(
        "/kamar",
        {
          id_jenis_kamar: jenisKamarName[0],
          id_kamar: noKamar,
        },
        { headers: header }
      )
      .then((res) => {
        getKamar();
        onOpenChange(false);
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const updateKamar = () => {
    const jenisKamarName = [...jenisKamar];

    axios
      .put(
        `/kamar/${noKamar}`,
        {
          id_jenis_kamar: jenisKamarName[0],
          id_kamar: noKamar,
        },
        { headers: header }
      )
      .then((res) => {
        getKamar();
        onOpenChange(false);
        setJenisKamar("");
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
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              onPress={() => onUpdate(data)}
              content="update kamar"
              color="primary"
              to="#"
              variant="flat"
            >
              Update
            </Button>
            <Button
              onPress={() => onDelete(data.id_kamar)}
              content="delete kamar"
              color="danger"
              variant="light"
              to="#"
            >
              Delete
            </Button>
          </div>
        );

      case "jenis_kamar":
        return <div>{data.f_k_kamar_in_jenis_kamar.nama}</div>;

      case "luas_kamar":
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
            <p className="font-bold text-inherit">Grand Atma Hotel</p>
          </NavbarBrand>
          <NavbarContent className="sm:flex gap-18" justify="center">
            <NavbarItem isActive>
              <NavLink color="foreground" to="#">
                Kamar
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink to="/jenis-kamar">Jenis Kamar</NavLink>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                onPress={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  localStorage.removeItem("id_account");
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
                setNoKamar("");
                setIdKamar(null);
                setJenisKamar("");
                onOpen();
              }}
              color="primary"
              className="mb-5 float-right"
            >
              Tambah Kamar
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
            <TableBody
              items={primaySearch || []}
              emptyContent={"No rows to display."}
            >
              {(item) => (
                <TableRow key={item.id_kamar}>
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
              <ModalHeader className="flex flex-col gap-1">Kamar</ModalHeader>

              <ModalBody>
                <h1 className="ml-2">Jenis Kamar</h1>
                <Select
                  items={tempJenisKamar || []}
                  type="text"
                  label="Jenis Kamar"
                  selectedKeys={jenisKamar}
                  onSelectionChange={setJenisKamar}
                >
                  {(temp) => (
                    <SelectItem key={temp.id_jenis_kamar}>
                      {temp.nama}
                    </SelectItem>
                  )}
                </Select>

                <h1 className="ml-2">Nomor Kamar</h1>
                <Input
                  value={noKamar}
                  onValueChange={setNoKamar}
                  type="number"
                  label="Nomor Kamar"
                  isDisabled={idKamar}
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onclose}>
                  Tutup
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    idKamar ? updateKamar() : addKamar();
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

export default Kamar;
