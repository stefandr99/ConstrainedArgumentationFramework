import {Container, Navbar} from "react-bootstrap";
import logo from './logo.png'

function MainNavigation() {
    return (
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand href="/">
                    <img
                        alt=""
                        src={logo}
                        width="40"
                        height="40"
                        className="d-inline-block align-top"
                    />{' '}
                    <b>Argumentation Framework</b>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default MainNavigation