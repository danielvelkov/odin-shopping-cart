import { useState } from "react";
import shopLogo from "/src/assets/online-shop-svgrepo-com.svg";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import CartContext from "/src/contexts/cartContext";

const Root = () => {
  const [cartItems, setCartItems] = useState([]);

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
          <StyledLink to={"/cart"}>
            <i className="fa fa-shopping-cart"></i>
            {cartItems.length > 0 && (
              <div className="cart-items-count">{cartItems.length}</div>
            )}
          </StyledLink>
          <Link to={"/favorites"}>
            <i className="fa fa-heart"></i>
          </Link>
        </Navbar>
      </Header>
      <Sidebar></Sidebar>
      <Main>
        <CartContext.Provider value={{ cartItems, setCartItems }}>
          <Outlet></Outlet>
        </CartContext.Provider>
      </Main>
      <Footer></Footer>
    </>
  );
};

const StyledLink = styled(Link)`
  position: relative;
  .cart-items-count {
    position: absolute;
    left: 1.3em;
    top: 1.4em;
    background-color: aliceblue;
    border: 2px solid #484c7a;
    border-radius: 50%;
    line-height: 1.5em;
    width: 1.5em;
    font-size: 0.6em;
    text-align: center;
  }
`;

const Navbar = styled.nav`
  display: flex;
  gap: 2em;
  font-size: 1.5em;
  flex-wrap: wrap;
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

  @media screen and (max-width: 520px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside``;

const Main = styled.main`
  padding: 2em;
`;

const Footer = styled.footer``;

export default Root;
