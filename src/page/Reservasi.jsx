import React, { useCallback, useEffect } from "react";

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
import { useNavigate } from "react-router-dom";

const Reservasi = () => {
  return (
    <>
      <div>
        <Navbar position="static">
          <NavbarBrand>
            <p className="font-bold text-inherit">Grand Atma Hotel</p>
          </NavbarBrand>
          <NavbarContent className="sm:flex gap-18" justify="center">
            <NavbarItem>
              <NavLink color="foreground" to="/customer">
                Customer
              </NavLink>
            </NavbarItem>
            <NavbarItem isActive>
              <NavLink color="foreground" to="/reservasi">
                Reservasi
              </NavLink>
            </NavbarItem>
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
            <NavbarItem>
              <NavLink to="/tarif">Tarif</NavLink>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button
                onPress={() => {
                  localStorage.removeItem("token");
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
    </>
  );
};

export default Reservasi;
