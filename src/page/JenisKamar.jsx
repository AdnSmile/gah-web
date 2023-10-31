import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";

const JenisKamar = () => {
  return (
    <div>
      <Navbar position="static">
        <NavbarBrand>
          <p className="font-bold text-inherit">Grand Atma Hotel</p>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-18" justify="center">
          <NavbarItem>
            <NavLink color="foreground" to="/kamar">
              Kamar
            </NavLink>
          </NavbarItem>
          <NavbarItem isActive>
            <NavLink to="/jenis-kamar">Jenis Kamar</NavLink>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              onPress={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("id_account");
              }}
              as={Link}
              color="primary"
              to="#"
              variant="flat"
            >
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
};

export default JenisKamar;
