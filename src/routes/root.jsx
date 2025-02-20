import { useContext, useState } from "react";
import shopLogo from "/src/assets/online-shop-svgrepo-com.svg";
import { Link, Outlet, useMatches } from "react-router-dom";
import styled from "styled-components";
import CartContext from "/src/contexts/cartContext";
import FavoritesContext from "/src/contexts/favoritesContext";
import CategoriesList from "../components/categoriesList";
import { RouteIds } from "../routes";

const Root = () => {
  const [favorites, setFavorites] = useState([]);
  const { cartItems } = useContext(CartContext);

  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];

  return (
    <RootLayout>
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
          <StyledLink to={"/cart"} aria-label="Shopping Cart">
            <i className="fa fa-shopping-cart"></i>
            {cartItems.size > 0 && (
              <div className="items-count-bubble">{cartItems.size}</div>
            )}
          </StyledLink>
          <StyledLink to={"/favorites"} aria-label="Favorites">
            <i className="fas fa-heart"></i>
            {favorites.length > 0 && (
              <div className="items-count-bubble">{favorites.length}</div>
            )}
          </StyledLink>
        </Navbar>
      </Header>
      <Sidebar>{getSidebar(currentRoute)}</Sidebar>
      <Main>
        <FavoritesContext value={{ favorites, setFavorites }}>
          <Outlet></Outlet>
        </FavoritesContext>
      </Main>
      <Footer></Footer>
    </RootLayout>
  );
};

const getSidebar = (currentRoute) => {
  switch (currentRoute.id) {
    case RouteIds.Index:
    case RouteIds.Products:
    case RouteIds.ProductsByCategory:
      return <CategoriesList></CategoriesList>;
    default:
      return <></>;
  }
};

const RootLayout = styled.section`
  min-height: 100vh;
  display: grid;
  grid-template-rows: minmax(auto, 100px) 3fr 3fr minmax(auto, 100px);
  grid-template-columns: 1fr 3fr 3fr 1fr;
  grid-template-areas:
    "header header header header"
    "aside main main ."
    "aside main main ."
    "footer footer footer footer ";
`;

const StyledLink = styled(Link)`
  position: relative;
  .items-count-bubble {
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
  position: relative;
  grid-area: header;
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

const Sidebar = styled.aside`
  grid-area: aside;
  background-color: #f9fafb;
  height: 100%;

  &:empty {
    display: none;
  }
`;

const Main = styled.main`
  padding: 2em;
  grid-area: main;
`;

const Footer = styled.footer`
  background-color: #3c4646;
  color: white;
  grid-area: footer;
`;

export default Root;
