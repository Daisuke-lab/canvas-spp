import React from 'react'
import { Navbar, Container,Nav  } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import styles from "../../../styles/Navbar.module.css"
import EditingNavBar from './EditingNavBar'
import File from './File'
function NavBar() {
  return (
    <>
  <Navbar bg="dark" variant="dark" style={{flexWrap: "wrap"}}>
    <Container style={{marginLeft: "0px"}}>
      <Navbar.Brand href="#home">
          <ArchitectureIcon/>
        {' '}
      ER Diagram Canvas Application
      </Navbar.Brand>
    </Container>
    <Container className={styles.navOptionsContainer}>
      <Nav.Item className={styles.navOption}>
          <File/>
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          Edit
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          Select
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          View
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          Insert
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          Share
      </Nav.Item>
      <Nav.Item className={styles.navOption}>
          Help
      </Nav.Item>
    </Container>
    <EditingNavBar/>
  </Navbar>
</>
  )
}

export default NavBar