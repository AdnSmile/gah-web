import { Link } from "react-router-dom";
import LogoDark from "../images/logo/logo-dark.svg";
import Logo from "../images/logo/logo.svg";
import { Button, Input } from "@nextui-org/react";
import axiosInstance from "../contexts/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [no_identitas, setNoIdentitas] = useState("");
  const [no_telp, setNoTelp] = useState("");
  const [alamat, setAlamat] = useState("");
  const navigate = useNavigate();

  const onRegister = () => {
    const role = ["customer"];

    axiosInstance
      .post("/auth/signup", {
        name: fullname,
        username: username,
        password,
        email,
        noIdentitas: no_identitas,
        noTelp: no_telp,
        alamat,
        role: role,
      })
      .then((res) => {
        console.log(res);
        navigate("/login");
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img src={Logo} alt="Logo" />
                <img className="dark:hidden" src={LogoDark} alt="Logo" />
              </Link>

              <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit
                suspendisse.
              </p>
            </div>
          </div>

          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block font-medium">Start for free</span>
              <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Register In to Grand Atma Hotel
              </h2>

              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Username
                  </label>
                  <div className="relative">
                    <Input
                      onValueChange={setUsername}
                      type="text"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Re-type Password
                  </label>
                  <div className="relative">
                    <Input
                      onValueChange={setPassword}
                      type="password"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Fullname
                  </label>
                  <div className="relative">
                    <Input
                      onValueChange={setFullname}
                      type="text"
                      placeholder="Enter your fullname"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      onValueChange={setEmail}
                      type="email"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Nomor Identitas
                  </label>
                  <div className="relative">
                    <Input
                      onValueChange={setNoIdentitas}
                      type="number"
                      placeholder="Masukan Nomor Identitas"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Nomor Telpon
                  </label>
                  <div className="relative">
                    <Input
                      onValueChange={setNoTelp}
                      type="number"
                      placeholder="Masukan Nomor Telpon"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Alamat
                  </label>
                  <div className="relative">
                    <Input
                      onValueChange={setAlamat}
                      type="text"
                      placeholder="Masukan Nomor Alamat"
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <Button onClick={onRegister}>Register</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
