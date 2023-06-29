import React, { useState, useEffect } from 'react';

const CartModal = ({ cartItems, onClose, onRemoveFromCart, onIncreaseQuantity, onDecreaseQuantity }) => {
  const [itemQuantities, setItemQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems, itemQuantities]);

  const handleRemoveItem = (itemId) => {
    onRemoveFromCart(itemId);
    const { [itemId]: removedItem, ...remainingQuantities } = itemQuantities;
    setItemQuantities(remainingQuantities);
  };


  const handleQuantityChange = (itemId, newQuantity) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: newQuantity,
    }));
    calculateTotalPrice();
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

  return (
    <div className="cart-modal">
      <h2>Shopping Cart</h2>
      <button onClick={onClose}>Close</button>
      {cartItems.length > 0 ? (
        <div>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <h3>{item.name}</h3>
                  <h3>{item.price}</h3>
                  <div>
                    <button
                      onClick={() => onIncreaseQuantity(item.id)}
                    >
                      +
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={itemQuantities[item.id] || 1}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    />
                    <button
                      onClick={() => onDecreaseQuantity(item.id)}
                    >
                      -
                    </button>
                  </div>
                  <p>Total Price: ${getTotalPrice(item)}</p>
                  <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total Purchase Price: {totalPrice}</h3>
        </div>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default CartModal;
