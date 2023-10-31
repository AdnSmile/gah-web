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

const Tarif = () => {
  return (
    <div>
      <Navbar position="static">
        <NavbarBrand>
          <p className="font-bold text-inherit">Grand Atma Hotel</p>
        </NavbarBrand>
        <NavbarContent className="sm:flex gap-18" justify="center">
          <NavbarItem>
            <NavLink color="foreground" to="/season">
              Season
            </NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink color="foreground" to="/fasilitas">
              Fasilitas
            </NavLink>
          </NavbarItem>
          <NavbarItem isActive>
            <NavLink to="/tarif">Tarif</NavLink>
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
};

export default Tarif;
