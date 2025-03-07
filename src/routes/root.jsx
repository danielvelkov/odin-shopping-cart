import { useContext, useEffect, useState } from "react";
import shopLogo from "/src/assets/online-shop-svgrepo-com.svg";
import { Link, Outlet, useMatches } from "react-router-dom";
import styled from "styled-components";
import CartContext from "/src/contexts/cartContext";
import FavoritesContext from "/src/contexts/favoritesContext";
import CategoriesList from "../components/categoriesList";
import { RouteIds } from "../routes";
import ProductFilters from "./productFilters";

const Root = () => {
  const [favorites, setFavorites] = useState([]);
  const { cartItems } = useContext(CartContext);

  const matches = useMatches();
  const currentRoute = matches[matches.length - 1];

  const [matchesSmallMedia, setMatchesSmallMedia] = useState(
    window?.matchMedia("(max-width: 620px)").matches,
  );

  useEffect(() => {
    window
      ?.matchMedia("(max-width: 620px)")
      .addEventListener("change", (e) => setMatchesSmallMedia(e.matches));
  }, []);

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
      {matchesSmallMedia &&
      currentRoute !== null &&
      (currentRoute.id === RouteIds.Products ||
        currentRoute.id === RouteIds.ProductsByCategory) ? (
        <ExpandableSidebar>
          <a
            href="#side"
            role="button"
            aria-expanded="false"
            aria-controls="side"
            className="open"
            aria-label="open sidebar"
          >
            ☰
          </a>
          <div className="overlay"></div>
          <Sidebar id="side">
            <a
              href="#"
              role="button"
              aria-expanded="true"
              aria-controls="side"
              className="close"
              aria-label="close sidebar"
            >
              <i className="fa fa-close"></i>
            </a>
            {getSidebar(currentRoute)}
          </Sidebar>
        </ExpandableSidebar>
      ) : (
        <Sidebar>{getSidebar(currentRoute)}</Sidebar>
      )}
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
      return <CategoriesList></CategoriesList>;
    case RouteIds.Products:
    case RouteIds.ProductsByCategory:
      return (
        <>
          <CategoriesList></CategoriesList>
          <ProductFilters></ProductFilters>
        </>
      );
    default:
      return <></>;
  }
};

const RootLayout = styled.section`
  min-height: 100vh;
  display: grid;
  grid-template-rows: minmax(auto, 150px) 3fr 3fr minmax(auto, 100px);
  grid-template-columns: auto 3fr 1fr;
  grid-template-areas:
    "header header header header"
    "aside main main ."
    "aside main main ."
    "footer footer footer footer ";

  @media screen and (max-width: 650px) {
    grid-template-rows: auto 1fr 1fr auto;
    grid-template-columns: 1fr;
    grid-template-areas:
      "header  header"
      "aside main "
      "aside main "
      "footer footer ";
  }
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

  @media screen and (max-width: 720px) {
    gap: 0.8em;
  }
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

  @media screen and (max-width: 620px) {
    padding: 1em;
  }
  @media screen and (max-width: 360px) {
    flex-wrap: wrap;
  }
`;

const Main = styled.main`
  padding: 2em;
  grid-area: main;
  @media screen and (max-width: 620px) {
    padding: 1em;
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

const ExpandableSidebar = styled.section`
  ${Sidebar} {
    position: fixed;
    top: 0;
    height: 100%;
    border-right: 1px solid #666;
    overflow-y: auto;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .overlay {
    display: none;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
  }

  &:has(${Sidebar}:target) {
    .overlay {
      display: block;
    }
  }

  ${Sidebar}:target {
    transform: translateX(0);
    z-index: 3;
    .close {
      display: block;
      float: right;
      font-size: large;
      padding: 1em;
    }
  }

  .open {
    position: fixed;
    background-color: aliceblue;
    padding: 0.1em 0.5em;
    border: 1px solid #666;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 10px;
    border-left: none;
  }

  .close {
    display: none;
  }
`;

const Footer = styled.footer`
  background-color: #3c4646;
  color: white;
  grid-area: footer;
`;

export default Root;
