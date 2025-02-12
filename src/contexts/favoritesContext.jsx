import { createContext } from "react";

const FavoritesContext = createContext({
  favorites: [],
  setFavorites: () => {},
});

export default FavoritesContext;
