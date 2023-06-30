import React, { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import CartModal from './CartModal';
import { FaShoppingCart, FaShoppingBag } from 'react-icons/fa';
import './styles.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [showCartButton, setShowCartButton] = useState(false);

  const handleItemCountChange = (count) => {
    setItemCount(count);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://mks-challenge-api-frontend.herokuapp.com/api/v1/products?page=1&rows=10&sortBy=id&orderBy=DESC',
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );
        const data = await response.json();
        setLoading(false);
        setShowCartButton(true);
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      return;
    }

    const updatedCartItems = [...cartItems, { ...product, quantity: 1 }];
    setCartItems(updatedCartItems);
    handleItemCountChange(itemCount + 1);
  };

  const handleRemoveFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  const handleIncreaseQuantity = (itemId) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
    });
  };

  const handleDecreaseQuantity = (itemId) => {
    setCartItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId && item.quantity > 0) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });
    });
  };

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const renderShimmers = () => {
    const shimmerCount = 3;
    const shimmers = [];

    for (let i = 0; i < shimmerCount; i++) {
      shimmers.push(
        <div key={i} className="shimmer-placeholder">
          <div className="shimmer-image"></div>
          <div className="shimmer-text"></div>
        </div>
      );
    }

    return shimmers;
  };

  return (
    <BrowserRouter>
      <div className="header-container">
        <h1 className="header-text">Header</h1>
        {showCartButton && (
        <button className="cartButton" onClick={() => handleCartOpen()}>
          {!loading && products.length > 0 && <FaShoppingCart />}
          <span className="itemCountNumber">{itemCount}</span>
        </button>
        )}
      </div>
        <div>
        <Routes>
          <Route
            path="/"
            element={
              <div className="product-grid">
                {loading ? (
                  <div>{renderShimmers()}</div>
                ) : products && products.length > 0 ? (
                  products.map((product, index) => {
                    const isProductInCart = cartItems.some((item) => item.id === product.id);

                    return (
                      <div key={product.id} className="product-card">
                        <img src={product.photo} alt={product.name} className="product-image" />
                        <h4 className="product-price">{product.price}</h4>
                        <h2 className="product-name">{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        <button
                          className="Comprar"
                          aria-hidden="true"
                          onClick={() => handleAddToCart(product)}
                          disabled={isProductInCart}
                        >
                          <FaShoppingBag />
                          {isProductInCart ? 'Inserido no carrinho' : 'COMPRAR'}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p>No products available.</p>
                )}
              </div>
            }
          />
        </Routes>

        {isCartOpen && (
          <div>
            <CartModal
              cartItems={cartItems}
              onClose={handleCartClose}
              onRemoveFromCart={handleRemoveFromCart}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
              onItemCountChange={handleItemCountChange}
            />
          </div>
        )}
        <h1 className="footer">Footer</h1>
      </div>
    </BrowserRouter>
  );
};

export default App;
