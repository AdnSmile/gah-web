import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import { Link, NavLink } from "react-router-dom";

export default function Navbarr() {
  return (
    <div>
      <Navbar position="static">
        <NavbarBrand>
          <p className="font-bold text-inherit">Grand Atma Hotel</p>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-18" justify="center">
          <NavbarItem>
            <NavLink
              // className={({ isActive }) =>
              //   `${
              //     isActive ? "bg-primary" : "hover:bg-white hover:bg-opacity-10"
              //   } flex items-center gap-2 rounded p-2`
              // }
              color="foreground"
              to="#"
            >
              Kamar
            </NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink to="/jenis-kamar" aria-current="page">
              Jenis Kamar
            </NavLink>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button as={Link} color="primary" to="#" variant="flat">
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
