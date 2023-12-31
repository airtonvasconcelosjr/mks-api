import React, { useState, useEffect } from 'react';
import './CartModal.css';

const CartModal = ({ cartItems, onClose, onRemoveFromCart, onItemCountChange }) => {
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    calculateTotalPrice();
    countItems();
  }, [cartItems, itemQuantities]);

  useEffect(() => {
    onItemCountChange(itemCount); 
  }, [itemCount, onItemCountChange]);

  const handleRemoveItem = (itemId) => {
    onRemoveFromCart(itemId);
    const { [itemId]: removedItem, ...remainingQuantities } = itemQuantities;
    setItemQuantities(remainingQuantities);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity >= 1) {
      setItemQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: newQuantity,
      }));
    }
  };

  const getTotalPrice = (item) => {
    const quantity = itemQuantities[item.id] || 1;
    return item.price * quantity;
  };

  const calculateTotalPrice = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += getTotalPrice(item);
    });
    setTotalPrice(total);
  };

  const countItems = () => {
    let count = 0;
    cartItems.forEach((item) => {
      count += itemQuantities[item.id] || 1;
    });
    setItemCount(count);
    onItemCountChange(count); // Atualiza a contagem de itens no componente pai
  };

  const handleIncreaseQuantity = (itemId) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 1) + 1,
    }));
  };

  const handleDecreaseQuantity = (itemId) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max((prevQuantities[itemId] || 1) - 1, 1),
    }));
  };

  return (
    <div className="cart-modal">
      <button className="btn-close" onClick={onClose}>X</button>
      <h2 className="cart-title">Carrinho de compras</h2>
      {cartItems.length > 0 ? (
        <div className="cart-content">
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-product-card">
                  <img src={item.photo} className="cart-product-img" alt="Imagem do produto" />
                  <div className="cart-product-details">
                    <div className="cart-product-info">
                      <h3 className="cart-product-name">{item.name}</h3>
                    </div>
                    <div className="cart-product-quantity">
                      <span className="cart-product-quantity-label">Qtd:</span>
                      <button className="quantity-minus-button" onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                      <input
                        className="cart-product-quantity-input"
                        inputMode="numeric"
                        min="1"
                        value={itemQuantities[item.id] || 1}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      />
                      <button className="quantity-plus-button" onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                    </div>
                  </div>
                  <p className="cart-product-price">R${getTotalPrice(item)}</p>
                  <div className="cart-product-info-mob">
                      <h3 className="cart-product-name-mob">{item.name}</h3>
                    </div>
                  <div className="cart-product-quantity-mob">
                    <span className="cart-product-quantity-label-mob">Qtd:</span>
                    <div className="quantity-price-container">
                      <button className="quantity-minus-button-mob" onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                      <input
                        className="cart-product-quantity-input-mob"
                        inputMode="numeric"
                        min="1"
                        value={itemQuantities[item.id] || 1}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      />
                         <button className="quantity-plus-button-mob" onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                      <span className="cart-product-price-mob">R$ {getTotalPrice(item)}</span>
                    </div>
                  </div>
                  <button className="cart-product-remove" onClick={() => handleRemoveItem(item.id)}>X</button>
                </div>
              </li>
            ))}
          </ul>
           
        </div>
         
      ) : (
        <p className="cart-message">Acrescente produtos ao carrinho</p>
      )}
      <div className="total-price">
        <span>Total:</span>
        <span>R$ {totalPrice}</span>
      </div>
      <h3 className="footer-cart">Finalizar Compra</h3>
    </div>
  );
  
  
};
  

export default CartModal;