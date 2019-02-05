import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import {Navbar, Nav, NavDropdown, Form, FormControl } from 'react-bootstrap'

import './NavBar-style.css'






const NavBar = (props) => {


    return (

      <React.Fragment>
          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">InvoiceApp</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/userProfile">Profile</Nav.Link>
                <Nav.Link href="/InvoiceGenerator">Invoice Generator</Nav.Link>
              </Nav>
              <Form inline className="d-none">
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-success">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Navbar>;
      </React.Fragment>

    )


}





export default NavBar;