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
  { name: "Fasilitas", uid: "nama_layanan" },
  { name: "Satuan", uid: "satuan" },
  { name: "Tarif", uid: "tarif_layanan" },
  { name: "Actions", uid: "actions" },
];

const Fasilitas = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [layanan, setLayanan] = React.useState([]);
  const [namaLayanan, setNamaLayanan] = React.useState("");
  const [satuan, setSatuan] = React.useState("");
  const [tarif, setTarif] = React.useState("");
  const [idLayanan, setIdLayanan] = React.useState("");
  const [search, setSearch] = React.useState([]);
  const [primaySearch, setPrimarySearch] = React.useState([]);
  const navigate = useNavigate();

  console.log(localStorage.getItem("token"));

  const token = localStorage.getItem("token");
  const header = {
    Authorization: `Bearer ${token}`,
  };

  const getFasilitas = () => {
    axios
      .get("/fasilitas", { headers: header })
      .then((res) => {
        console.log(res.data.data);

        setLayanan(res.data.data);
        setPrimarySearch(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        // console.log(header.Authorization);
        // localStorage.removeItem("token");
        // navigate("/login");
        const code = err.response.status;
        console.log(code);
        if (code == 403 || code == 401) navigate("/unauthorize");
      });
  };

  useEffect(() => {
    getFasilitas();
  }, []);

  useEffect(() => {
    if (!search) {
      setPrimarySearch(layanan);
      return;
    }

    const dataFasilitas = layanan.filter((row) => {
      return (
        row.nama_layanan
          .toLowerCase()
          .includes(search?.trim()?.toLowerCase()) ||
        row.satuan.toLowerCase().includes(search?.trim()?.toLowerCase()) ||
        row.tarif_layanan
          .toString()
          .toLowerCase()
          .includes(search?.trim()?.toLowerCase())
      );
    });

    setPrimarySearch(dataFasilitas);
  }, [search]);

  const onUpdate = (layanan) => {
    setIdLayanan(layanan.id_layanan);
    setNamaLayanan(layanan.nama_layanan);
    setSatuan(layanan.satuan);
    setTarif(layanan.tarif_layanan);
    onOpenChange(true);
  };

  const onDelete = (id) => {
    axios
      .delete(`/fasilitas/${id}`, { headers: header })
      .then((res) => {
        getFasilitas();
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const addFasilitas = () => {
    axios
      .post(
        "/fasilitas",
        {
          nama_layanan: namaLayanan,
          satuan: satuan,
          tarif_layanan: tarif,
        },
        { headers: header }
      )
      .then((res) => {
        getFasilitas();
        onOpenChange(false);
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const updateFasilitas = () => {
    axios
      .put(
        `/fasilitas/${idLayanan}`,
        {
          nama_layanan: namaLayanan,
          satuan: satuan,
          tarif_layanan: tarif,
        },
        { headers: header }
      )
      .then((res) => {
        getFasilitas();
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
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Button
              onPress={() => onUpdate(data)}
              content="update fasilitas"
              color="primary"
              to="#"
              variant="flat"
            >
              Update
            </Button>
            <Button
              onPress={() => onDelete(data.id_layanan)}
              content="delete fasilitas"
              to="#"
              color="danger"
              variant="light"
            >
              Delete
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
        <Navbar position="static">
          <NavbarBrand>
            <p className="font-bold text-inherit">Grand Atma Hotel</p>
          </NavbarBrand>
          <NavbarContent className="sm:flex gap-18" justify="center">
            <NavbarItem>
              <NavLink color="foreground" to="/season">
                Season
              </NavLink>
            </NavbarItem>
            <NavbarItem isActive>
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
                  localStorage.removeItem("token");
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
                setSatuan("");
                setIdLayanan(null);
                setNamaLayanan("");
                setTarif("");
                onOpen();
              }}
              color="primary"
              className="mb-5 float-right"
            >
              Tambah Fasilitas
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
                <TableRow key={item.id_layanan}>
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
                Fasilitas
              </ModalHeader>

              <ModalBody>
                <h1 className="ml-2">Nama Layanan</h1>
                <Input
                  value={namaLayanan}
                  onValueChange={setNamaLayanan}
                  type="text"
                  label="Nama Layanan"
                />

                <h1 className="ml-2">Satuan</h1>
                <Input
                  value={satuan}
                  onValueChange={setSatuan}
                  type="text"
                  label="Satuan"
                />

                <h1 className="ml-2">Tarif Layanan</h1>
                <Input
                  value={tarif}
                  onValueChange={setTarif}
                  type="number"
                  label="Tarif Layanan"
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onclose}>
                  Tutup
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    idLayanan ? updateFasilitas() : addFasilitas();
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

export default Fasilitas;
