import { useCallback, useEffect, useState } from "react";

import {
  Button,
  Input,
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
import axios from "axios";
import { useNavigate } from "react-router-dom";

const titleTableKamar = [
  { name: "Jenis Kamar", uidd: "jenis_kamar" },
  { name: "Harga Kamar Permalam", uidd: "harga_kamar" },
  { name: "Jumlah Malam", uidd: "jumlah_malam" },
];

const titleTableFasilitas = [
  { name: "Fasilitas", uid: "fasilitas" },
  { name: "Jumlah", uid: "jumlah" },
  { name: "Harga", uid: "harga" },
  { name: "Subtotal", uid: "subtotal" },
];

const CheckOut = () => {
  const [layanan, setLayanan] = useState([]);
  const [kamar, setKamar] = useState([]);

  const idReservasi = localStorage.getItem("id_reservasi");
  const idBooking = localStorage.getItem("id_booking");

  const [totalBayarKamar, setTotalBayarKamar] = useState("");
  const [totalBayarLayanan, setTotalBayarLayanan] = useState("");
  const [pajak, setPajak] = useState("");
  const [totalSemua, setTotalSemua] = useState("");
  const [totalAkhir, setTotalAkhir] = useState(""); // total_harga
  const [deposit, setDeposit] = useState("");
  const [jaminan, setJaminan] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [tglCheckIn, setTglCheckIn] = useState("");
  const [tglCheckOut, setTglCheckOut] = useState("");
  const [inputUang, setInputUang] = useState("");
  const [isLebih, setIsLebih] = useState(false);
  const dateIn = localStorage.getItem("tgl_checkin_fo");
  const dateOut = localStorage.getItem("tgl_checkout_fo");

  const token = localStorage.getItem("token");
  const header = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();

  const getReservasi = (idReservasi) => {
    axios
      .get(`/reservasi/${idReservasi}`, { headers: header })
      .then((res) => {
        setLayanan(res.data.data.f_k_reservasi_in_fasilitas);
        setKamar(res.data.data.f_k_reservasi_in_transaksi_kamar);
        setNamaCustomer(res.data.data.f_k_reservasi_in_customer.nama);
        setTglCheckIn(res.data.data.tgl_checkin);
        setTglCheckOut(res.data.data.tgl_checkout);

        setTotalBayarKamar(res.data.data.total_pembayaran);
        setTotalBayarLayanan(res.data.data.total_layanan);
        setDeposit(res.data.data.total_deposit);
        setJaminan(res.data.data.uang_jaminan);
        setPajak(res.data.data.total_layanan * 0.1);
        setTotalSemua(
          res.data.data.total_pembayaran +
            res.data.data.total_layanan +
            res.data.data.total_layanan * 0.1
        );
        setTotalAkhir(
          res.data.data.total_pembayaran +
            res.data.data.total_layanan +
            res.data.data.total_layanan * 0.1 -
            res.data.data.uang_jaminan -
            res.data.data.total_deposit
        );
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        alert(err.response.data.message);
        // if (code == 403 || code == 401) navigate("/unauthorize");
      });
  };

  useEffect(() => {
    getReservasi(idReservasi);
  }, []);

  console.log(idReservasi);
  console.log(`Total bayar kamar: ${totalBayarKamar}`);
  console.log(`Total bayar layanan: ${totalBayarLayanan}`);
  console.log(`Pajak: ${pajak}`);
  console.log(`Total Semua: ${totalSemua}`);
  console.log(`Jaminan: ${jaminan}`);
  console.log(`Deposit: ${deposit}`);
  console.log(`Total Akhir: ${totalAkhir}`);
  console.log("===========================");

  const checkout = (idReservasi, uang) => {
    axios
      .post(
        `/checkout/${idReservasi}`,
        {
          uang_pembayaran: uang,
        },
        { headers: header }
      )
      .then((res) => {
        console.log(res);

        if (isLebih) {
          alert(
            res.data.message +
              ", Uang kembalian : " +
              formatRupiah(uang - totalAkhir)
          );
        } else {
          // alert(
          //   res.data.message +
          //     ", Kembalian Deposit customer : " +
          //     formatRupiah(totalAkhir * -1)
          // );
          alert(res.data.message);
        }
        window.print();
        navigate("/checkin_list");
      })
      .catch((err) => {
        console.log(err);
        const code = err.response.status;
        console.log(code);
        alert(err.response.data.message);
        setInputUang("");
        // if (code == 403 || code == 401) navigate("/unauthorize");
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
    const options = { year: "numeric", month: "short", day: "numeric" };

    return date.toLocaleDateString("id-ID", options);
  };

  const jumlahMalam = () => {
    const checkInDate = new Date(dateIn);
    const checkOutDate = new Date(dateOut);

    console.log("check in : " + dateIn);
    console.log("check out : " + dateOut);
    // Menghitung selisih hari
    return Math.floor((checkOutDate - checkInDate) / (24 * 60 * 60 * 1000));
  };

  const buildTableKamar = useCallback((data, columnKey) => {
    const row = data[columnKey];

    // console.log(row);

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

    // console.log(row);

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
          Check Out
        </CardHeader>
        <CardBody className="gap-3">
          <Divider />
          <div>ID TRANSAKSI : {idBooking}</div>
          <div>Customer : {namaCustomer}</div>
          <div>Check In : {formatDate(tglCheckIn)}</div>
          <div>Check Out : {formatDate(tglCheckOut)}</div>

          <Table removeWrapper>
            <TableHeader columns={titleTableKamar}>
              {(column) => (
                <TableColumn key={column.uidd}>{column.name}</TableColumn>
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

          <Divider />

          <div>Total Kamar : {formatRupiah(totalBayarKamar)}</div>
          <div>Total Fasilitas : {formatRupiah(totalBayarLayanan)}</div>
          <div>Pajak : {formatRupiah(pajak)}</div>

          <div>Total Sebelum Potongan : {formatRupiah(totalSemua)}</div>
          <Divider />
          <div>
            <p>Uang Jaminan : {formatRupiah(jaminan)}</p>
          </div>
          <div>Uang Deposit : {formatRupiah(deposit)}</div>
          <Divider />
          {totalAkhir > 0 ? (
            <div>
              <p>
                Total bayar customer :{" "}
                <strong>{formatRupiah(totalAkhir)}</strong>
              </p>

              <Input
                label="Uang Customer"
                type="number"
                max={totalAkhir}
                value={inputUang}
                onValueChange={setInputUang}
                className="pt-3 pb-3"
              />
            </div>
          ) : (
            <div>
              <p>
                Total kembalian customer :{" "}
                <strong>{formatRupiah(totalAkhir * -1)}</strong>
              </p>
            </div>
          )}

          <Button
            onPress={() => {
              if (confirm("Apakah anda yakin ingin check out?")) {
                if (totalAkhir > 0) {
                  setIsLebih(true);
                  checkout(idReservasi, inputUang);
                } else {
                  checkout(idReservasi, 0);
                }
              }
            }}
            variant="flat"
            color="primary"
          >
            Check Out
          </Button>
          <Button
            onPress={() => {
              navigate("/checkin_list");
            }}
            color="danger"
            variant="light"
          >
            Batal Check Out
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default CheckOut;
