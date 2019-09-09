import React from "react"
import { Navbar } from "react-bootstrap"

// import { injectGlobal } from "emotion"

// injectGlobal`
//   .navbar-inverse {
//       background-color: transparent !important;
//       .navbar-brand {
//         color: #333 !important;
//         font-size: 24px !important;
//         margin-top: 40px;
//       }
//     },
// `

const NavigationBar = () => (
  <Navbar inverse collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#brand">The BirthDay Project</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    {/* <Navbar.Collapse>
      <Nav>
        <NavDropdown eventKey={3} title="Dropdown" id="basic-nav-dropdown">
          <MenuItem eventKey={3.1}>Action</MenuItem>
          <MenuItem eventKey={3.2}>Another action</MenuItem>
          <MenuItem eventKey={3.3}>Something else here</MenuItem>
          <MenuItem divider />
          <MenuItem eventKey={3.3}>Separated link</MenuItem>
        </NavDropdown>
      </Nav>
      <Nav pullRight>
        <NavItem eventKey={1} href="#">
          Link Right
        </NavItem>
        <NavItem eventKey={2} href="#">
          Link Right
        </NavItem>
      </Nav>
    </Navbar.Collapse> */}
  </Navbar>
)

export default NavigationBar
