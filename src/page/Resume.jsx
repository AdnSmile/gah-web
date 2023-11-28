import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Divider,
  Card,
  CardHeader,
  CardBody,
} from "@nextui-org/react";
// import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const titleTableKamar = [
  { name: "Jenis Kamar", uid: "jenis_kamar" },
  { name: "Harga Kamar Permalam", uid: "harga_kamar" },
  { name: "Jumlah Malam", uid: "jumlah_malam" },
];

const titleTableFasilitas = [
  { name: "Fasilitas", uid: "fasilitas" },
  { name: "Jumlah", uid: "jumlah" },
  { name: "Harga", uid: "harga" },
  { name: "Subtotal", uid: "subtotal" },
];

const Resume = () => {
  const [layanan, setLayanan] = useState([]);
  const [kamar, setKamar] = useState([]);
  const [reservasi, setReservasi] = useState();
  const idReservasi = localStorage.getItem("id_reservasi");

  const [idTransaksi, setIdTransaksi] = useState("");
  const [totalBayar, setTotalBayar] = useState(0);
  localStorage.setItem("total_bayar", totalBayar);

  const tgl_in = localStorage.getItem("tanggal_checkin");
  const tgl_out = localStorage.getItem("tanggal_checkout");

  const token = localStorage.getItem("token");
  const header = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const getReservasi = (idReservasi) => {
    axios
      .get(`/reservasi/${idReservasi}`, { headers: header })
      .then((res) => {
        setReservasi(res.data.data);

        setLayanan(res.data.data.f_k_reservasi_in_fasilitas);
        setKamar(res.data.data.f_k_reservasi_in_transaksi_kamar);
        setIdTransaksi(res.data.data.id_booking);
        setTotalBayar(res.data.data.total_pembayaran);
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        // if (code == 403 || code == 401) navigate("/unauthorize");
      });
  };

  console.log(reservasi);
  console.log(layanan);
  console.log(kamar);
  console.log(idTransaksi);
  console.log(totalBayar);

  useEffect(() => {
    getReservasi(idReservasi);
  }, []);

  const formatRupiah = (uang) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(uang);
  };

  const jumlahMalam = () => {
    const checkInDate = new Date(tgl_in);
    const checkOutDate = new Date(tgl_out);

    // Menghitung selisih hari
    return Math.floor((checkOutDate - checkInDate) / (24 * 60 * 60 * 1000));
  };

  console.log("jumlah malam: " + jumlahMalam());

  const buildTableKamar = useCallback((data, columnKey) => {
    const row = data[columnKey];

    console.log(row);

    switch (columnKey) {
      case "jenis_kamar":
        return <div>{data.f_k_transaksi_kamar_in_jenis_kamar.nama}</div>;
      case "harga_kamar":
        return <div>{formatRupiah(data.harga_per_malam)}</div>;

      case "jumlah_malam":
        return <div>{jumlahMalam()}</div>;
      default:
        return row;
    }
  }, []);

  const buildTableFasilitas = useCallback((data, columnKey) => {
    const row = data[columnKey];

    console.log(row);

    switch (columnKey) {
      case "fasilitas":
        return (
          <div>{data.f_k_transaksi_fasilitas_in_fasilitas.nama_layanan}</div>
        );
      case "harga":
        return (
          <div>
            {formatRupiah(
              data.f_k_transaksi_fasilitas_in_fasilitas.tarif_layanan
            )}
          </div>
        );
      case "subtotal":
        return <div>{formatRupiah(data.sub_total)}</div>;
      default:
        return row;
    }
  }, []);

  return (
    <div className="flex justify-center items-center gap-4">
      <Card className="max-w-[900px]">
        <CardHeader className="flex flex-col gap-1 text-xl">
          Resume Pemesanan
        </CardHeader>

        <CardBody className="gap-4">
          <div className="">ID TRANSAKSI: {idTransaksi}</div>

          <Table removeWrapper>
            <TableHeader columns={titleTableKamar}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={kamar || []} emptyContent={"No rows to display."}>
              {(item) => (
                <TableRow key={item.id_transaksi_kamar}>
                  {(columnKey) => (
                    <TableCell>{buildTableKamar(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Table removeWrapper>
            <TableHeader columns={titleTableFasilitas}>
              {(column) => (
                <TableColumn key={column.uid}>{column.name}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={layanan || []}
              emptyContent={"No rows to display."}
            >
              {(item) => (
                <TableRow key={item.id_layanan}>
                  {(columnKey) => (
                    <TableCell>
                      {buildTableFasilitas(item, columnKey)}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="text-sm">
            <strong>*Fasilitas dibayar nanti</strong>
          </div>
          <div>Total Pembayaran: {formatRupiah(totalBayar)}</div>
          <Divider />
          <div>Bayar pada bank: Bank Diamond atas nama PT Atma Jaya</div>
          <div>Nomor Rekening : 770011770022</div>

          <Button
            onPress={() => {
              // confirm("Sudah yakin membayar sekarang?")
              //   ? navigate("/pembayaran")
              //   : null;
              navigate("/pembayaran");
            }}
          >
            Lakukan Pembayaran Uang Muka
          </Button>

          <Button
            onPress={() => {
              // confirm("Sudah yakin membayar sekarang?")
              //   ? navigate("/pembayaran")
              //   : null;
              navigate("/uang_muka");
            }}
            color="danger"
            variant="light"
          >
            Bayar Nanti
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Resume;
