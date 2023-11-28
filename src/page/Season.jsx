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
  RadioGroup,
  Radio,
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
  { name: "Nama Season", uid: "nama" },
  { name: "Jenis Season", uid: "jenis" },
  { name: "Tanggal Mulai", uid: "start_season" },
  { name: "Tanggal Selesai", uid: "end_season" },
  { name: "Actions", uid: "actions" },
];

const selectionJenis = [
  { id: 1, name: "high" },
  { id: 2, name: "promo" },
];

const Season = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [season, setSeason] = React.useState([]);
  const [namaSeason, setNamaSeason] = React.useState("");
  const [jenisSeason, setJenisSeason] = React.useState("");
  const [startSeason, setStartSeason] = React.useState();
  const [endSeason, setEndSeason] = React.useState();
  const [idSeason, setIdSeason] = React.useState("");
  const [search, setSearch] = React.useState([]);
  const [primaySearch, setPrimarySearch] = React.useState([]);
  const navigate = useNavigate();

  const header = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
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

        setSeason(res.data.data);
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
    getSeason();
  }, []);

  useEffect(() => {
    if (!search) {
      setPrimarySearch(season);
      return;
    }

    const dataFasilitas = season.filter((row) => {
      return (
        row.nama.toLowerCase().includes(search?.trim()?.toLowerCase()) ||
        row.jenis.toLowerCase().includes(search?.trim()?.toLowerCase())
      );
    });

    setPrimarySearch(dataFasilitas);
  }, [search]);

  const onUpdate = (season) => {
    setIdSeason(season.id_season);
    setNamaSeason(season.nama);
    setJenisSeason(season.jenis);
    setStartSeason(season.start_season);
    setEndSeason(season.end_season);
    onOpenChange(true);
  };

  const onDelete = (id) => {
    axios
      .delete(`/season/${id}`, { headers: header })
      .then((res) => {
        getSeason();
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const addSeason = () => {
    axios
      .post(
        "/season",
        {
          nama: namaSeason,
          jenis: jenisSeason,
          start_season: startSeason,
          end_season: endSeason,
        },
        { headers: header }
      )
      .then((res) => {
        getSeason();
        onOpenChange(false);
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const updateSeason = () => {
    axios
      .put(
        `/season/${idSeason}`,
        {
          nama: namaSeason,
          jenis: jenisSeason,
          start_season: startSeason,
          end_season: endSeason,
        },
        { headers: header }
      )
      .then((res) => {
        getSeason();
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
              content="update season"
              color="primary"
              to="#"
              variant="flat"
            >
              Update
            </Button>
            <Button
              onPress={() =>
                confirm(`Apakah anda yakin menghapus season ${data.nama}?`)
                  ? onDelete(data.id_season)
                  : null
              }
              content="delete season"
              to="#"
              color="danger"
              variant="light"
            >
              Delete
            </Button>
          </div>
        );

      // case "start_season":
      //   return <div>{data.start_date}</div>;
      // case "end_season":
      //   return <div>{data.end_date}</div>;
      default:
        return row;
    }
  }, []);

  console.log(localStorage.getItem("token"));
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
            <NavbarItem>
              <NavLink color="foreground" to="/uang_muka">
                Uang Muka
              </NavLink>
            </NavbarItem>
            <NavbarItem isActive>
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
                setNamaSeason("");
                setIdSeason(null);
                setJenisSeason("");
                setStartSeason(null);
                setEndSeason(null);
                onOpen();
              }}
              color="primary"
              className="mb-5 float-right"
            >
              Tambah Season
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
                <TableRow key={item.id_season}>
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
                <h1 className="ml-2">Nama Season</h1>
                <Input
                  value={namaSeason}
                  onValueChange={setNamaSeason}
                  type="text"
                />

                <h1 className="ml-2">Tanggal Mulai</h1>
                <Input
                  value={startSeason}
                  onValueChange={setStartSeason}
                  type="date"
                  labelPlacement={startSeason}
                />

                <h1 className="ml-2">Tanggal Selesai</h1>
                <Input
                  value={endSeason}
                  onValueChange={setEndSeason}
                  type="date"
                />

                <h1 className="ml-2">Jenis Season</h1>
                <RadioGroup
                  color="secondary"
                  onValueChange={setJenisSeason}
                  defaultValue={jenisSeason}
                >
                  <Radio value="high">High</Radio>
                  <Radio value="promo">Promo</Radio>
                </RadioGroup>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onclose}>
                  Tutup
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    idSeason
                      ? confirm("Apakah anda yakin ingin update season ini?")
                        ? updateSeason()
                        : onOpenChange(false)
                      : confirm("Apakah anda yakin ingin menambah season ini?")
                      ? addSeason()
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

export default Season;
