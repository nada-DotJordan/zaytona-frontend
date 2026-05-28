import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("zaytona_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("zaytona_cart", JSON.stringify(items));
  }, [items]);

  function addToCart(product, version) {
    setItems(prev => {
      const exists = prev.find(
        i =>
          (i.product._id || i.product.id) === (product._id || product.id) &&
          i.version.year === version.year
      );
      if (exists) {
        return prev.map(i =>
          (i.product._id || i.product.id) === (product._id || product.id) &&
          i.version.year === version.year
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { product, version, qty: 1 }];
    });
  }

  function removeFromCart(productId, year) {
    setItems(prev =>
      prev.filter(
        i =>
          !((i.product._id || i.product.id) === productId &&
            i.version.year === year)
      )
    );
  }

  function updateQty(productId, year, qty) {
    if (qty <= 0) {
      removeFromCart(productId, year);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        (i.product._id || i.product.id) === productId &&
        i.version.year === year
          ? { ...i, qty }
          : i
      )
    );
  }

  function clearCart() {
    setItems([]);
    localStorage.removeItem("zaytona_cart");
  }

  function clearCartOnLogout() {
    setItems([]);
    localStorage.removeItem("zaytona_cart");
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.version.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        clearCartOnLogout,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}