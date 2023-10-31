import { Link } from "react-router-dom";
import LogoDark from "../images/logo/logo-dark.svg";
import Logo from "../images/logo/logo.svg";
import { Button, Input } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  console.log(localStorage.getItem("token"));

  const onLogin = () => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    };

    axios
      .post(
        "/login",
        {
          username: username,
          password: password,
        },
        config
      )
      .then((res) => {
        console.log(res);
        alert(res.data.message);

        localStorage.setItem("token", res.data.data.token);

        console.log(localStorage.getItem("token"));

        const role = res.data.data.account.role;

        if (role == "admin") {
          navigate("/kamar");
        }

        if (role == "sm") {
          navigate("/season");
        }

        if (role == "customer") {
          // navigate("/season");
          alert("Customer login");
        }
      })
      .catch((err) => {
        alert(err.response.message);
      });
  };

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-row items-center">
          <div className="w-1/2">
            <img src="deluxe_room.jpg" />
          </div>

          <div className="w-1/2 border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <span className="mb-1.5 block text-center font-medium">
                Start for free
              </span>
              <h2 className="mb-9 text-center text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Login In to Grand Atma Hotel
              </h2>

              <form>
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    username
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

                <div className="mb-5 text-center">
                  <Button onClick={onLogin}>Login</Button>
                </div>

                <div className="mt-6 text-center">
                  <p>
                    Don’t have any account?{" "}
                    <Link to="/register" className="text-primary">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
