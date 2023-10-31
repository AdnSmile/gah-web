import React from "react";
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
  Tooltip,
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

const Season = () => {
  return (
    <div>
      <Navbar position="static">
        <NavbarBrand>
          <p className="font-bold text-inherit">Grand Atma Hotel</p>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-18" justify="center">
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
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("id_account");
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
    </div>
  );
};

export default Season;
