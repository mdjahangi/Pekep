import React, { useState, useEffect } from "react";

// Enhanced sample products with better images
const SAMPLE_PRODUCTS = [
  { 
    id: "bag-001", 
    name: "GG Marmont Matelassé Mini Bag", 
    price: 1280, 
    sku: "GG-SB-001", 
    desc: "Crafted from soft matelassé leather with a distinctive chevron pattern and iconic GG hardware.", 
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", 
    category: "Bags",
    features: ["Italian leather", "Gold-tone hardware", "Adjustable chain strap", "Magnetic closure"]
  },
  { 
    id: "belt-001", 
    name: "GG Supreme Web Belt", 
    price: 450, 
    sku: "GG-BLT-001", 
    desc: "Iconic GG Supreme canvas belt with green-red-green web stripe and interchangeable buckle.", 
    img: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=400&h=300&fit=crop", 
    category: "Accessories",
    features: ["Adjustable sizing", "Signature web stripe", "Double G buckle", "Canvas material"]
  },
  { 
    id: "shoe-001", 
    name: "Princetown Leather Slippers", 
    price: 650, 
    sku: "GG-SH-001", 
    desc: "Luxurious leather slippers with horsebit detail and comfortable shearling lining.", 
    img: "https://images.unsplash.com/photo-1542280756-74b2f55e73ab?w=400&h=300&fit=crop", 
    category: "Footwear",
    features: ["Shearling lined", "Leather sole", "Horsebit detail", "Made in Italy"]
  },
  { 
    id: "wallet-001", 
    name: "Marmont Card Case", 
    price: 320, 
    sku: "GG-WLT-001", 
    desc: "Compact card case in matelassé leather with GG logo and multiple card slots.", 
    img: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop", 
    category: "Accessories",
    features: ["4 card slots", "Matelassé leather", "Snap button closure", "Compact design"]
  }
];

// Utility Components
function Money({ amount, className = "" }) {
  return (
    <span className={className}>
      ${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </span>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
    </div>
  );
}

function Notification({ message, type = "success", onClose }) {
  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";
  
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
      {message}
    </div>
  );
}

// Main Component
export default function GucciMVP() {
  const [products] = useState(SAMPLE_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gucci-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('gucci-cart', JSON.stringify(cart));
  }, [cart]);

  // Cart functions
  function addToCart(product, qty = 1) {
    setCart((c) => {
      const found = c.find((x) => x.id === product.id);
      let newCart;
      
      if (found) {
        newCart = c.map((x) => 
          x.id === product.id ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        newCart = [...c, { ...product, qty }];
      }
      
      return newCart;
    });
    
    showNotification(`${product.name} added to cart`);
  }

  function removeFromCart(id) {
    const product = cart.find(item => item.id === id);
    setCart((c) => c.filter((x) => x.id !== id));
    showNotification(`${product.name} removed from cart`);
  }

  function updateQty(id, qty) {
    if (qty < 1) return;
    if (qty > 10) {
      showNotification("Maximum quantity per item is 10", "error");
      return;
    }
    
    setCart((c) => 
      c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))
    );
  }

  function clearCart() {
    setCart([]);
    showNotification("Cart cleared");
  }

  function showNotification(message, type = "success") {
    setNotification({ message, type });
  }

  // Filter products based on search and category
  const categories = ["All", ...new Set(products.map(p => p.category))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate totals
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 0 ? (subtotal > 1000 ? 0 : 25) : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Mock checkout function
  async function handleCheckout(formData) {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setCart([]);
    setShowCheckout(false);
    showNotification("Order placed successfully! Thank you for your purchase.");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)} 
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold tracking-tight">GUCCI</div>
              <nav className="hidden md:ml-8 md:flex space-x-8">
                <a href="#new" className="text-gray-700 hover:text-black">New Arrivals</a>
                <a href="#bags" className="text-gray-700 hover:text-black">Bags</a>
                <a href="#shoes" className="text-gray-700 hover:text-black">Shoes</a>
                <a href="#accessories" className="text-gray-700 hover:text-black">Accessories</a>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden sm:block">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-1 border rounded-lg text-sm w-48"
                />
              </div>
              
              {/* Cart Indicator */}
              <button 
                onClick={() => setShowCheckout(true)}
                className="relative p-2 text-gray-700 hover:text-black"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.qty, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <section className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">GG Marmont Collection</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the iconic GG Marmont line featuring luxurious leather goods with distinctive chevron pattern.
          </p>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm border ${
                    selectedCategory === category 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="text-sm text-gray-600">
              {filteredProducts.length} products found
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products Grid */}
          <section className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <article key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.img} 
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-white px-2 py-1 rounded text-xs font-medium">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.desc}</p>
                    
                    <div className="flex items-center justify-between">
                      <Money amount={product.price} className="text-lg font-semibold" />
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => setSelected(product)}
                          className="p-2 text-gray-600 hover:text-black"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Cart Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Shopping Cart</h4>
                {cart.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 pb-4 border-b">
                      <img 
                        src={item.img} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-sm truncate">{item.name}</h5>
                          <Money amount={item.price * item.qty} className="font-semibold" />
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="px-2 py-1 hover:bg-gray-100"
                              disabled={item.qty <= 1}
                            >
                              -
                            </button>
                            <span className="px-3 py-1 text-sm">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              className="px-2 py-1 hover:bg-gray-100"
                              disabled={item.qty >= 10}
                            >
                              +
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Order Summary */}
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <Money amount={subtotal} />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : <Money amount={shipping} />}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <Money amount={tax} />
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <Money amount={total} />
                      </div>
                    </div>

                    {subtotal > 1000 && (
                      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                        🎉 Free shipping unlocked!
                      </div>
                    )}

                    <button
                      onClick={() => setShowCheckout(true)}
                      disabled={isLoading}
                      className="w-full mt-4 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </main>
      </div>

      {/* Product Details Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img 
                src={selected.img} 
                alt={selected.name}
                className="w-full h-96 md:h-full object-cover"
              />
              
              <div className="p-6">
                <button 
                  onClick={() => setSelected(null)}
                  className="ml-auto block text-gray-500 hover:text-black mb-4"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <h2 className="text-2xl font-bold mb-2">{selected.name}</h2>
                <p className="text-gray-600 mb-4">{selected.desc}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selected.features?.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold mb-4">
                    <Money amount={selected.price} />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        addToCart(selected, 1);
                        setSelected(null);
                      }}
                      className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => setSelected(null)}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:border-black"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <p>SKU: {selected.sku}</p>
                  <p>Category: {selected.category}</p>
                  <p>Made in Italy • Premium Materials • Quality Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Checkout</h3>
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-500 hover:text-black"
                  disabled={isLoading}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button 
                    onClick={() => setShowCheckout(false)}
                    className="px-6 py-2 border border-black rounded-lg hover:bg-gray-50"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleCheckout(formData);
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-4">Contact Information</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Email Address</label>
                          <input 
                            type="email" 
                            name="email"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-4">Shipping Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">First Name</label>
                          <input 
                            type="text" 
                            name="firstName"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Last Name</label>
                          <input 
                            type="text" 
                            name="lastName"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Address</label>
                          <input 
                            type="text" 
                            name="address"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">City</label>
                          <input 
                            type="text" 
                            name="city"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">ZIP Code</label>
                          <input 
                            type="text" 
                            name="zipCode"
                            required
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-black focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="md:col-span-2">
                      <h4 className="font-semibold mb-4">Payment Method</h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="radio" name="payment" value="card" defaultChecked className="mr-2" />
                          Credit Card
                        </label>
                        <label className="flex items-center">
                          <input type="radio" name="payment" value="paypal" className="mr-2" />
                          PayPal
                        </label>
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="md:col-span-2 border-t pt-6">
                      <h4 className="font-semibold mb-4">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.name} × {item.qty}</span>
                            <Money amount={item.price * item.qty} />
                          </div>
                        ))}
                        
                        <div className="border-t pt-2 space-y-1">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <Money amount={subtotal} />
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : <Money amount={shipping} />}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <Money amount={tax} />
                          </div>
                          <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Total</span>
                            <Money amount={total} />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing Order...
                          </div>
                        ) : (
                          `Place Order - ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold mb-4">GUCCI</h5>
              <p className="text-sm text-gray-600">
                Luxury Italian fashion house specializing in leather goods, ready-to-wear, and accessories.
              </p>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Customer Service</h6>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-black">Contact Us</a></li>
                <li><a href="#" className="hover:text-black">Shipping Info</a></li>
                <li><a href="#" className="hover:text-black">Returns</a></li>
                <li><a href="#" className="hover:text-black">Size Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">About</h6>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-black">Our Story</a></li>
                <li><a href="#" className="hover:text-black">Sustainability</a></li>
                <li><a href="#" className="hover:text-black">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h6 className="font-semibold mb-4">Legal</h6>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><a href="#" className="hover:text-black">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-black">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2024 Gucci. All rights reserved. This is a demo application.</p>
          </div>
        </div>
      </footer>
    </div>
  );
    }
