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
  { name: "Nama Season", uid: "nama_season" },
  { name: "Jenis Kamar", uid: "jenis_kamar" },
  { name: "Tarif", uid: "tarif" },
  { name: "Actions", uid: "actions" },
];

const Tarif = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [tarif, setTarif] = React.useState([]);
  const [idTarif, setIdTarif] = React.useState("");
  const [tempJenisKamar, setTempJenisKamar] = React.useState([]);
  const [tempSeason, setTempSeason] = React.useState([]);
  const [jenisKamar, setJenisKamar] = React.useState("");
  const [season, setSeason] = React.useState("");
  const [tarifHarga, setTarifHarga] = React.useState("");
  const [search, setSearch] = React.useState([]);
  const [primaySearch, setPrimarySearch] = React.useState([]);
  const navigate = useNavigate();

  const header = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const getTarif = () => {
    axios
      .get("/tarif", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);

        setTarif(res.data.data);
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

  const getSeason = () => {
    axios
      .get("/season", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data.data);

        setTempSeason(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        if (code == 403 || code == 401) navigate("/unauthorize");
      });
  };

  useEffect(() => {
    getTarif();
  }, []);

  useEffect(() => {
    getSeason();
  }, []);

  useEffect(() => {
    getJenisKamar();
  }, []);

  useEffect(() => {
    if (!search) {
      setPrimarySearch(tarif);
      return;
    }

    const dataKamar = tarif.filter((row) => {
      return (
        row.fk_tarif_in_jenis_kamar.nama
          .toLowerCase()
          .includes(search?.trim()?.toLowerCase()) ||
        row.fk_tarif_in_season.nama
          .toLowerCase()
          .includes(search?.trim()?.toLowerCase())
      );
    });

    setPrimarySearch(dataKamar);
  }, [search]);

  const onUpdate = (tarif) => {
    setIdTarif(tarif.id_tarif);
    setSeason(new Set([tarif.id_season.toString()]));
    setJenisKamar(new Set([tarif.id_jenis_kamar.toString()]));
    setTarifHarga(tarif.tarif);
    onOpenChange(true);
  };

  const onDelete = (id) => {
    axios
      .delete(`/tarif/${id}`, { headers: header })
      .then((res) => {
        getTarif();
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const addTarif = () => {
    const jenisKamarName = [...jenisKamar];
    const seasonName = [...season];

    axios
      .post(
        "/tarif",
        {
          id_season: seasonName[0],
          id_jenis_kamar: jenisKamarName[0],
          tarif: tarifHarga,
        },
        { headers: header }
      )
      .then((res) => {
        getTarif();
        onOpenChange(false);
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const updateTarif = () => {
    const jenisKamarName = [...jenisKamar];
    const seasonName = [...season];

    axios
      .put(
        `/tarif/${idTarif}`,
        {
          id_season: seasonName[0],
          id_jenis_kamar: jenisKamarName[0],
          tarif: tarifHarga,
        },
        { headers: header }
      )
      .then((res) => {
        getTarif();
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
              onPress={() =>
                confirm(
                  `Apakah anda yakin menghapus season ${data.fk_tarif_in_season.nama}?`
                )
                  ? onDelete(data.id_tarif)
                  : null
              }
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
        return <div>{data.fk_tarif_in_jenis_kamar.nama}</div>;

      case "nama_season":
        return <div>{data.fk_tarif_in_season.nama}</div>;
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
            <NavbarItem isActive>
              <NavLink to="/tarif">Tarif</NavLink>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                onPress={() => {
                  localStorage.clear();
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
                setIdTarif(null);
                setJenisKamar("");
                setSeason("");
                setTarifHarga("");
                onOpen();
              }}
              color="primary"
              className="mb-5 float-right"
            >
              Tambah Tarif
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
                <TableRow key={item.id_tarif}>
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
              <ModalHeader className="flex flex-col gap-1">Tarif</ModalHeader>

              <ModalBody>
                <h1 className="ml-2">Nama Season</h1>
                <Select
                  items={tempSeason || []}
                  type="text"
                  label="Nama Season"
                  selectedKeys={season}
                  onSelectionChange={setSeason}
                >
                  {(temp) => (
                    <SelectItem key={temp.id_season}>{temp.nama}</SelectItem>
                  )}
                </Select>

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

                <h1 className="ml-2">Tarif Harga</h1>
                <Input
                  value={tarifHarga}
                  onValueChange={setTarifHarga}
                  type="number"
                  label="Tarif"
                />
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onclose}>
                  Tutup
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    idTarif
                      ? confirm("Apakah anda yakin ingin update tarif ini?")
                        ? updateTarif()
                        : onOpenChange(false)
                      : confirm("Apakah anda yakin ingin tambah tarif ini?")
                      ? addTarif()
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

export default Tarif;
