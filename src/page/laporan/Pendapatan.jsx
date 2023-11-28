import { useCallback, useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const titleTable = [
  { name: "Bulan", uid: "bulan" },
  { name: "Grup", uid: "grup" },
  { name: "Personal", uid: "personal" },
  { name: "Total", uid: "total" },
];

const dataTahun = [
  { name: "2023", uid: "2023" },
  { name: "2024", uid: "2024" },
  { name: "2025", uid: "2025" },
  { name: "2026", uid: "2026" },
];

const Pendapatan = () => {
  const [dataPendapatan, setDataPendapatan] = useState([]);
  const [tahun, setTahun] = useState(0);
  const navigate = useNavigate();

  const currentDate = new Date();
  const dateString = currentDate.toISOString().split("T")[0];

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

  const getDataCustomer = (year) => {
    axios
      .get(`/pendapatan_bulanan/${year}`, { headers: header })
      .then((res) => {
        console.log(res.data.data);
        setDataPendapatan(res.data.data);
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

  const formatRupiah = (uang) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(uang);
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { year: "numeric", month: "long", day: "numeric" };

    return date.toLocaleDateString("id-ID", options);
  };

  const totalPendapatan = () => {
    let total = 0;
    for (let i = 0; i < dataPendapatan.length; i++) {
      total += parseInt(dataPendapatan[i].total);
    }

    return total;
  };

  console.log("Pendapatan: " + totalPendapatan());

  const buildTable = useCallback((data, columnKey) => {
    const row = data[columnKey];

    // console.log(row);

    switch (columnKey) {
      case "bulan":
        return <div>{data.bulan}</div>;
      case "grup":
        return <div>{formatRupiah(data.grup)}</div>;
      case "personal":
        return <div>{formatRupiah(data.personal)}</div>;
      case "total":
        return <div>{formatRupiah(data.total)}</div>;

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
              <NavLink color="foreground" to="/laporan/customer_baru">
                Customer Baru
              </NavLink>
            </NavbarItem>
            <NavbarItem isActive>
              <NavLink color="foreground" to="/laporan/pendapatan">
                Pendapatan
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink color="foreground" to="/laporan/jumlah_tamu">
                Jumlah Tamu
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink color="foreground" to="/laporan/pemesan_terbanyak">
                Pemesan Terbanyak
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
          <h1 className=" flex justify-center pb-4 text-xl">
            Pendapatan Perjenis Tamu Perbulan
          </h1>
          <div className="flex justify-end gap-4 mb-2">
            <Select
              className="h-10 w-40"
              items={dataTahun}
              type="text"
              label="Pilih Tahun"
              selectedKeys={tahun}
              onSelectionChange={setTahun}
            >
              {(temp) => <SelectItem key={temp.uid}>{temp.name}</SelectItem>}
            </Select>

            <Button
              onPress={() => {
                console.log(JSON.stringify(tahun));
                console.log(tahun.currentKey);
                getDataCustomer(tahun.currentKey);
              }}
              color="primary"
              className="mb-5 float-right"
            >
              Tampil
            </Button>
          </div>

          <Table>
            <TableHeader columns={titleTable}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={dataPendapatan || []}
              emptyContent={"No rows to display."}
            >
              {(item) => (
                <TableRow key={item.bulan}>
                  {(columnKey) => (
                    <TableCell>{buildTable(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className=" pt-4">
            Total Pendapatan: {formatRupiah(totalPendapatan())}
          </div>
          <div className=" pt-4">Dicetak Tanggal: {formatDate(dateString)}</div>
        </div>
      </div>
    </>
  );
};

export default Pendapatan;
