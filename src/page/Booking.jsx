import React, { useCallback, useEffect, useState } from "react";

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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  SelectItem,
} from "@nextui-org/react";
import Grid from "@material-ui/core/Grid";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <div className="items-center">
            <Card className="max-w-[900px] ">
              <CardHeader>
                <h1>Booking</h1>
              </CardHeader>
            </Card>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Booking;
