import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import CartContext from "src/contexts/cartContext";
import { getProduct } from "src/products.js";
import { USDollar } from "../utils/priceFormatter";
import { Link } from "react-router-dom";
import CartActions from "../contexts/action-types/cartActions";

// Claude AI generated this from two sentences and a snippet. WOW O_o
const Cart = () => {
  const { cartItems, dispatch } = useContext(CartContext);
  const [productsCache, setProductsCache] = useState(new Map());

  // Fetch only missing products
  useEffect(() => {
    const fetchMissingProducts = async () => {
      const missingIds = [...cartItems]
        .filter(([key]) => !productsCache.has(key))
        .map(([key]) => key);

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
  }, [cartItems]);

  // Memoize the listed items with their quantities
  const listedItems = useMemo(() => {
    return [...cartItems]
      .map(([key, cartItem]) => ({
        ...productsCache.get(key),
        ...cartItem,
      }))
      .filter(Boolean);
  }, [cartItems, productsCache]);

  const handleQuantityChange = useCallback(
    (productId, newQuantity) => {
      dispatch({ type: CartActions.UPDATE, id: productId, newQuantity });
    },
    [dispatch],
  );

  const handleRemoveItem = useCallback(
    (productId) => {
      dispatch({ type: CartActions.REMOVE, id: productId });
    },
    [dispatch],
  );

  // Memoize the item renderer
  const renderCartItem = useCallback(
    (item) => (
      <tr className="cart-item" key={item.id}>
        <td>
          <div className="product-details">
            <div className="image-container">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="product-info">
              <h4>{item.title}</h4>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="remove-button"
              >
                Remove
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </div>
        </td>
        <td>
          <span className="price">{USDollar.format(item.price)}</span>
        </td>
        <td>
          <div className="quantity-controls">
            <button
              className="quantity-btn"
              onClick={() =>
                handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
              }
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
            />
            <button
              className="quantity-btn"
              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>
        </td>
        <td>
          <span className="subtotal">
            {USDollar.format(item.price * item.quantity)}
          </span>
        </td>
      </tr>
    ),
    [handleQuantityChange, handleRemoveItem],
  );

  const total = useMemo(
    () =>
      listedItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [listedItems],
  );

  return (
    <CartPage>
      <header>
        <h2>Shopping Cart</h2>
        <span className="item-count">{listedItems.length} items</span>
      </header>

      {listedItems.length > 0 ? (
        <>
          <CartItemsTable>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {listedItems.map((item) => {
                // for some reason listedItems has undefined items inside in the beginning
                if (item.id) return renderCartItem(item);
              })}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" colSpan="3">
                  Total
                </th>
                <td>{USDollar.format(total)}</td>
              </tr>
            </tfoot>
          </CartItemsTable>
          <button className="checkout-button">
            Checkout <i className="fa fa-shopping-bag"></i>
          </button>
        </>
      ) : (
        <section className="empty-shopping-cart">
          <h2>
            Your shopping cart is empty<br></br>
            Check out our <Link to={"/products"}>Products</Link>
          </h2>
        </section>
      )}
    </CartPage>
  );
};

const CartPage = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0rem 2rem;
  display: flex;
  flex-direction: column;

  header {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 2rem;

    h2 {
      font-size: 2em;
      font-weight: 700;
      margin: 0;
      color: #5a5e9a;
    }

    .item-count {
      color: #666;
    }
  }

  .checkout-button {
    margin-top: 1em;
    padding: 0.5em 2em;
    background-color: orange;
    font-size: 1.2em;
    font-weight: 600;
    border-radius: 5px;
    max-width: 333px;
    align-self: flex-end;

    &:hover {
      background-color: #ffa600d3;
    }
  }

  .empty-shopping-cart {
    padding: 2em;
    border-radius: 2em;
    background-color: white;
    text-align: center;
  }
`;

const CartItemsTable = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    font-weight: 500;
    color: #666;
    background-color: #f0f8ff;
    min-width: 10ch;
  }

  .cart-item {
    &:hover {
      background-color: #f9fafb;
    }

    .product-details {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .image-container {
      max-width: 100px;
      padding: 0.5rem;
      background-color: #f9fafb;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .product-info {
      display: flex;
      flex-direction: column;
      gap: 1em;
      h4 {
        margin: 0;
        font-size: 1rem;
        font-weight: 500;
      }
    }

    .remove-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0;
      color: #666;
      background: none;
      border: none;
      font-size: 0.875rem;
      cursor: pointer;

      &:hover {
        color: #ef4444;
      }
    }

    .price,
    .subtotal {
      font-weight: 500;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input {
        height: 2em;
        width: 3em;
        -moz-appearance: textfield;
      }

      .quantity-btn {
        width: 2em;
        height: 2em;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #ddd;
        border-radius: 4px;
        background: white;
        cursor: pointer;

        &:hover {
          background-color: #f3f4f6;
        }
      }
    }
  }

  tfoot {
    tr {
      th,
      td {
        padding: 1.5rem 1rem;
        font-weight: 600;
        font-size: 1.125rem;
      }
    }
  }
`;

export default Cart;
