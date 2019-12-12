import React from "react"
import { useFireBaseContext } from "providers/Firebase"
import { Navbar, Nav, NavDropdown, MenuItem } from "react-bootstrap"

function NavigationBar() {
  const fire = useFireBaseContext()
  // const u = fire.auth.currentUser && fire.auth.currentUser.email
  return (
    <div>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="#brand">Crack the party!</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavDropdown eventKey={1} title="About me" id="basic-nav-dropdown">
              <MenuItem eventKey={1.1}>Edit Profile</MenuItem>
              <MenuItem eventKey={1.2}>Settings</MenuItem>
              <MenuItem divider />
              <MenuItem eventKey={1.3} onClick={fire.doSignOut}>
                Sign out
              </MenuItem>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}

export default NavigationBar
