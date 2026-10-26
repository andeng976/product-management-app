import { useState } from "react";

import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import AddProduct from "./components/AddProduct";
import Cart from "./components/Cart";

import "./App.css";

// DEFAULT PRODUCTS: COMPUTER SHOP
const initialProducts = [
  {
    id: 1,
    name: "Gaming Laptop",
    category: "Electronics",
    description:
      "A powerful laptop for school projects, programming, and gaming.",
    specification: "16GB RAM, 512GB SSD",
    rating: 4.9,
    price: 35000,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    category: "Accessories",
    description:
      "A comfortable keyboard for typing, coding, and gaming.",
    specification: "RGB lighting, USB connection",
    rating: 4.7,
    price: 1800,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 3,
    name: "Gaming Mouse",
    category: "Accessories",
    description:
      "A responsive mouse for everyday computer use and gaming.",
    specification: "Adjustable DPI, USB connection",
    rating: 4.6,
    price: 950,
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 4,
    name: "Gaming Headset",
    category: "Electronics",
    description:
      "A headset for listening to music, online classes, and gaming.",
    specification: "Over-ear design, built-in microphone",
    rating: 4.8,
    price: 1500,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
  },
];

function App() {
  const [products, setProducts] = useState(initialProducts);

  const [cart, setCart] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");

  // FILTER PRODUCTS
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  // ADD TO CART
  function addToCart(id) {
    const product = products.find(
      (item) => item.id === id
    );

    if (!product || product.stock <= 0) {
      alert("This product is out of stock.");
      return;
    }

    const cartItem = cart.find(
      (item) => item.id === id
    );

    if (cartItem && cartItem.quantity >= product.stock) {
      alert("You have reached the available stock limit.");
      return;
    }

    setCart((previousCart) => {
      const existingItem = previousCart.find(
        (item) => item.id === id
      );

      if (existingItem) {
        return previousCart.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          id,
          quantity: 1,
        },
      ];
    });
  }

  // INCREASE QUANTITY
  function increaseQuantity(id) {
    const product = products.find(
      (item) => item.id === id
    );

    const cartItem = cart.find(
      (item) => item.id === id
    );

    if (!product || !cartItem) {
      return;
    }

    if (cartItem.quantity >= product.stock) {
      alert("No more stock available.");
      return;
    }

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  // DECREASE QUANTITY
  function decreaseQuantity(id) {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  // ADD NEW PRODUCT
  function addProduct(newProduct) {
    const productWithId = {
      ...newProduct,
      id: Date.now(),
    };

    setProducts((previousProducts) => [
      ...previousProducts,
      productWithId,
    ]);
  }

  // TOTAL ITEMS IN CART
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // COMPUTE OVERALL TOTAL
  const overallTotal = cart.reduce(
    (total, item) => {
      const product = products.find(
        (product) => product.id === item.id
      );

      return product
        ? total + product.price * item.quantity
        : total;
    },
    0
  );

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div>
          <h1>💻 TechZone Computer Shop</h1>

          <p>
            Your trusted store for computer products
            and accessories.
          </p>
        </div>

        <div className="cart-counter">
          🛒 Cart: {cartCount}
        </div>
      </header>

      <main className="container">
        {/* PRODUCT LIST */}
        <section className="products-section">
          <div className="section-heading">
            <div>
              <h2>Computer Products</h2>

              <p>
                Find the right equipment for your needs.
              </p>
            </div>

            {/* CATEGORY FILTER */}
            <div className="filter-container">
              <label htmlFor="category-filter">
                Category:
              </label>

              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
              >
                <option value="All">All Products</option>

                <option value="Electronics">
                  Electronics
                </option>

                <option value="Accessories">
                  Accessories
                </option>

                <option value="Fashion">
                  Fashion
                </option>

                <option value="Home">
                  Home
                </option>
              </select>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <p>No products found in this category.</p>
          ) : (
            <ProductList
              products={filteredProducts}
              cart={cart}
              onAddToCart={addToCart}
              onIncrease={increaseQuantity}
              onDecrease={decreaseQuantity}
              onViewDetails={setSelectedProduct}
            />
          )}
        </section>

        {/* SHOPPING CART */}
        <Cart
          cart={cart}
          products={products}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
        />

        {/* ORDER SUMMARY */}
        <section className="summary-card">
          <h2>📋 Order Summary</h2>

          <p>
            Total Items: <strong>{cartCount}</strong>
          </p>

          <h3>
            Total Amount: ₱
            {overallTotal.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </h3>
        </section>

        {/* ADD PRODUCT FORM */}
        <AddProduct onAddProduct={addProduct} />

        {/* FOOTER */}
        <footer className="footer">
          <p>
            TechZone Computer Shop | React + Vite
          </p>
        </footer>
      </main>

      {/* PRODUCT DETAILS MODAL */}
      <ProductDetails
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default App;