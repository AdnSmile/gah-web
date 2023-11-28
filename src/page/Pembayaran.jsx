import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  Input,
  Card,
  CardHeader,
  CardBody,
  useDisclosure,
  SelectItem,
} from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Pembayaran = () => {
  const totalTagihan = localStorage.getItem("total_bayar");
  const idReservasi = localStorage.getItem("id_reservasi");
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [jumlahBayar, setJumlahBayar] = useState("");

  const token = localStorage.getItem("token");
  const header = {
    Authorization: `Bearer ${token}`,
  };

  const formatRupiah = (uang) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(uang);
  };

  const bayarGrup = (idReservasi) => {
    console.log("bayar Grup");

    axios
      .patch(
        `/newReservasiSm/${idReservasi}`,
        {
          uang_jaminan: jumlahBayar,
        },
        { headers: header }
      )
      .then((res) => {
        console.log(res.data);
        alert(res.data.message);
        localStorage.removeItem("id_reservasi");
        navigate("/customer");
      })
      .catch((err) => {
        alert(err.response.data.message);
        const code = err.response.status;
        // if (code == 403 || code == 401) navigate("/unauthorize");
      });
  };

  const bayarCustomer = (idReservasi) => {
    console.log("bayar customer");

    axios
      .patch(
        `/newReservasiCus/${idReservasi}`,
        {
          uang_jaminan: jumlahBayar,
        },
        { headers: header }
      )
      .then((res) => {
        console.log(res.data);
        alert(res.data.message);
        localStorage.removeItem("id_reservasi");
        if (role == "customer") {
          navigate("/reservasi");
        } else {
          navigate("/customer");
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
        const code = err.response.status;
        if (code == 403 || code == 401) navigate("/unauthorize");
      });
  };

  // console.log(totalTagihan);
  return (
    <div className="flex justify-center items-center gap-4">
      <Card className="">
        <CardHeader className="flex flex-col gap-1 text-xl">
          Pembayaran Uang Jaminan
        </CardHeader>

        <CardBody className="gap-4">
          <div>Total Tagihan: {formatRupiah(totalTagihan)}</div>

          {role == "sm" && (
            <div className="text-sm">
              <strong>*Minimal Pembayaran 50%</strong>
            </div>
          )}

          <Input
            label="Masukan Uang Jaminan"
            type="number"
            max={totalTagihan}
            value={jumlahBayar}
            onValueChange={setJumlahBayar}
          />

          <Button
            onPress={() => {
              confirm("Yakin Membayar?")
                ? role == "sm"
                  ? bayarGrup(idReservasi)
                  : bayarCustomer(idReservasi)
                : null;
            }}
          >
            Bayar
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default Pembayaran;
