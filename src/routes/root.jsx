import shopLogo from "/src/assets/online-shop-svgrepo-com.svg";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

const Root = () => {
  return (
    <>
      <Header>
        <Link to={"/"}>
          <span className="logo">
            <img src={shopLogo}></img>
            <h1>MockShop</h1>
          </span>
        </Link>
        <Navbar>
          <Link to={"/"}>Home</Link>
          <Link to={"/products"}>
            Products <i className="fa"></i>
          </Link>
          <Link to={"/cart"}>
            <i className="fa fa-shopping-cart"></i>
          </Link>
          <Link to={"/favorites"}>
            <i className="fa fa-heart"></i>
          </Link>
        </Navbar>
      </Header>
      <Sidebar></Sidebar>
      <Main>
        <Outlet></Outlet>
      </Main>
      <Footer></Footer>
    </>
  );
};

const Navbar = styled.nav`
  display: flex;
  gap: 2em;
`;

const Header = styled.header`
  background-color: aliceblue;
  padding: 1em 3em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
  box-shadow: 2px 2px 10px gray;

  .logo {
    height: 4em;
    padding: 1.5em;
    display: flex;
    gap: 1em;
    align-items: center;

    h1 {
      font-weight: 800;
    }

    img {
      height: 100%;
    }
  }
`;

const Sidebar = styled.aside``;

const Main = styled.main`
  padding: 2em;
`;

const Footer = styled.footer``;

export default Root;
