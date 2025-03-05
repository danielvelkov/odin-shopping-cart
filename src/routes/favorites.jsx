import { useContext, useEffect, useMemo, useState } from "react";
import FavoritesContext from "src/contexts/favoritesContext";
import styled from "styled-components";
import StarRating from "src/components/starRating";
import { getProduct } from "../products";
import { useNavigate } from "react-router-dom";

// claude ai helped a lot. Basically generated 90% cuz im lazy
const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, setFavorites } = useContext(FavoritesContext);
  const [productsCache, setProductsCache] = useState(new Map());

  // Fetch only missing products
  useEffect(() => {
    const fetchMissingProducts = async () => {
      const missingIds = [...favorites].filter((id) => !productsCache.has(id));

      if (missingIds.length === 0) return;

      try {
        const newProducts = await Promise.all(
          missingIds.map((id) => getProduct(id)),
        );

        setProductsCache((prevCache) => {
          const newCache = new Map(prevCache);
          newProducts.forEach((product) => {
            newCache.set(product.id, product);
          });
          return newCache;
        });
      } catch (error) {
        throw new Error("Error fetching products:", error);
      }
    };

    fetchMissingProducts();
  }, [favorites]);

  // Memoize the listed items with their quantities
  const listedItems = useMemo(() => {
    return [...favorites].map((id) => productsCache.get(id)).filter(Boolean);
  }, [favorites, productsCache]);

  const handleRemoveFavorite = (id) => {
    setFavorites((prev) => prev.filter((productId) => productId !== id));
  };

  return (
    <FavoritesContainer>
      <Header>
        <Title>Your Favorites</Title>
        <span className="item-count">{listedItems.length} items</span>
      </Header>

      {listedItems.length === 0 ? (
        <EmptyMessage>
          You don&apos;t have any favorite products yet. Start shopping to add
          items to your favorites!
        </EmptyMessage>
      ) : (
        <ProductList>
          {listedItems.map((product) => (
            <ProductItem key={product.id}>
              <ProductImage src={product.image} alt={product.title} />

              <ProductInfo>
                <ProductTitle>{product.title}</ProductTitle>
                <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
                <ProductRating>
                  <StarRating
                    rating={product.rating.rate}
                    votes={product.rating.count}
                  ></StarRating>
                </ProductRating>
              </ProductInfo>

              <ButtonContainer>
                <ViewButton onClick={() => navigate("/products/" + product.id)}>
                  View Product
                </ViewButton>
                <RemoveButton onClick={() => handleRemoveFavorite(product.id)}>
                  Remove
                </RemoveButton>
              </ButtonContainer>
            </ProductItem>
          ))}
        </ProductList>
      )}
    </FavoritesContainer>
  );
};

// Styled Components
const FavoritesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  align-items: baseline;
  gap: 1em;
  .item-count {
    color: #666;
  }
`;

const Title = styled.h2`
  font-size: 2em;
  font-weight: 700;
  margin: 0;
  color: #5a5e9a;
`;

const EmptyMessage = styled.p`
  color: #666;
  font-size: 16px;
  text-align: center;
`;

const ProductList = styled.ul`
  padding: 0;
  list-style: none;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProductItem = styled.li`
  display: flex;
  align-items: center;
  padding: 1em;
  border-bottom: 2px solid #eee;
`;

const ProductImage = styled.img`
  max-width: 100px;
  padding: 1em;
  object-fit: contain;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h3`
  color: #222;
`;

const ProductPrice = styled.p`
  margin: 0 0 5px 0;
  font-weight: bold;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  color: #666;
  font-size: 0.8em;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
  padding: 0.5em 1em;
  border: none;
  border-radius: 4px;
  font-size: large;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const ViewButton = styled(Button)`
  background-color: #123a68;
  color: white;
`;

const RemoveButton = styled(Button)`
  background-color: #5c79a0;
  color: white;
`;

export default Favorites;
