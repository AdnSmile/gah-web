import React, { useCallback, useEffect, useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Select,
  SelectItem,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const titleTable = [
  { name: "No", uid: "nomor" },
  { name: "Jenis Kamar", uid: "jenis_kamar" },
  { name: "Grup", uid: "grup" },
  { name: "Personal", uid: "personal" },
  { name: "Jumlah", uid: "jumlah" },
];

const dataTahun = [
  { name: "2023", uid: "2023" },
  { name: "2024", uid: "2024" },
  { name: "2025", uid: "2025" },
  { name: "2026", uid: "2026" },
];

const dataBulan = [
  { name: "Januari", uid: "1" },
  { name: "Februari", uid: "2" },
  { name: "Maret", uid: "3" },
  { name: "April", uid: "4" },
  { name: "Mei", uid: "5" },
  { name: "Juni", uid: "6" },
  { name: "Juli", uid: "7" },
  { name: "Agustus", uid: "8" },
  { name: "September", uid: "9" },
  { name: "Oktober", uid: "10" },
  { name: "November", uid: "11" },
  { name: "Desember", uid: "12" },
];

const JumlahTamu = () => {
  const [data, setData] = useState([]);
  const [tahun, setTahun] = useState(0);
  const [bulan, setBulan] = useState(0);
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

  const getDataCustomer = (year, month) => {
    axios
      .get(`/jumlah_customer/${year}/${month}`, { headers: header })
      .then((res) => {
        console.log(res.data.data);
        setData(res.data.data);
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

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { year: "numeric", month: "long", day: "numeric" };

    return date.toLocaleDateString("id-ID", options);
  };

  const buildTable = useCallback((data, columnKey) => {
    const row = data[columnKey];

    // console.log(row);

    switch (columnKey) {
      case "nomor":
        return <div>{data.id_jenis_kamar}</div>;
      case "jenis_kamar":
        return <div>{data.jenis_kamar}</div>;
      case "grup":
        return <div>{data.grup}</div>;
      case "personal":
        return <div>{data.personal}</div>;
      case "jumlah":
        return <div>{data.jumlah}</div>;

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
            <NavbarItem>
              <NavLink color="foreground" to="/laporan/pendapatan">
                Pendapatan
              </NavLink>
            </NavbarItem>
            <NavbarItem isActive>
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
            LAPORAN JUMLAH TAMU
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

            <Select
              className="h-10 w-40"
              items={dataBulan}
              type="text"
              label="Pilih Bulan"
              selectedKeys={bulan}
              onSelectionChange={setBulan}
            >
              {(temp) => <SelectItem key={temp.uid}>{temp.name}</SelectItem>}
            </Select>

            <Button
              onPress={() => {
                getDataCustomer(tahun.currentKey, bulan.currentKey);
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

            <TableBody items={data || []} emptyContent={"No rows to display."}>
              {(item) => (
                <TableRow key={item.id_jenis_kamar}>
                  {(columnKey) => (
                    <TableCell>{buildTable(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className=" pt-4">
            Total Customer:{" "}
            {data.reduce((total, item) => total + item.jumlah, 0)}
          </div>
          <div className=" pt-4">Dicetak Tanggal: {formatDate(dateString)}</div>
        </div>
      </div>
    </>
  );
};

export default JumlahTamu;
