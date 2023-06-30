import React, { useState, useEffect } from 'react';

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
      <h2>Shopping Cart</h2>
      {cartItems.length > 0 ? (
        <div className="cart-content">
          <ul className="cart-items">
            {cartItems.map((item) => (
              <h5 key={item.id} className="cart-item">
                <div>
                  <h3>{item.name}</h3>
                  <h3>{item.price}</h3>
                  <div>
                    <h5>Qtd:</h5>
                    <button onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                    <input
                      className="qtd"
                      inputMode="numeric"
                      min="1"
                      value={itemQuantities[item.id] || 1}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    />
                    <button onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                  </div>
                  <p>Total Price: ${getTotalPrice(item)}</p>
                  <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                </div>
              </h5>
            ))}
          </ul>
          <div className="cart-footer">
            <h3 className="total-price">Total Purchase Price: {totalPrice}</h3>
          </div>
        </div>
      ) : (
        <p>No items in the cart.</p>
      )}
      <p>Item count: {itemCount}</p>
    </div>
  );
};

export default CartModal;
