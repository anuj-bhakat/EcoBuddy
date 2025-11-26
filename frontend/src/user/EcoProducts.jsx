import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Cart from "./Cart";
import { FaLeaf, FaChevronLeft, FaChevronRight, FaSearch, FaSortAmountDown, FaSortAmountUp, FaSortAlphaDown, FaSortAlphaUp, FaShoppingCart } from "react-icons/fa";

const sampleProducts = [
  {
    id: "1a2b3c4d",
    name: "Bamboo Toothbrush",
    description:
      "Eco-friendly bamboo toothbrush with soft bristles. 100% biodegradable handle.",
    price_points: 10,
    images: [
      "https://m.media-amazon.com/images/I/81p8pNstgGL._UF1000,1000_QL80_.jpg",
      "https://5.imimg.com/data5/SELLER/Default/2021/11/RP/GI/TL/140258896/natural-bamboo-tooth-brush.png",
    ],
    created_at: "2025-09-01T10:00:00Z",
  },
  {
    id: "5e6f7g8h",
    name: "Reusable Grocery Bag",
    description:
      "Strong and washable reusable grocery bag made from organic cotton and recycled materials.",
    price_points: 25,
    images: [
      "https://satopradhan.com/cdn/shop/products/grocery-bag-made-with-heavy-duty-canvas-cloth-thoughtfully-designed-reusable-shopping-bag-with-two-printed-sides-satopradhan-1-31091186401506.png?v=1696575016",
      "https://thehumanbean.com/cdn/shop/products/EarthDay.jpg?v=1724105985&width=1946",
    ],
    created_at: "2025-08-15T08:30:00Z",
  },
  {
    id: "9i0j1k2l",
    name: "Solar Powered Lantern",
    description:
      "Portable solar lantern perfect for camping and emergency lighting, with long-lasting LED bulbs.",
    price_points: 100,
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs0oG7eTGPkleQHunbQp4AQzw6jsdjpENKbA&s",
      "https://5.imimg.com/data5/BZ/AX/QP/SELLER-20876600/solar-laltern-500x500.jpg",
    ],
    created_at: "2025-09-10T12:45:00Z",
  },
  {
    id: "2b4c5d6e",
    name: "Eco-Friendly Water Bottle",
    description:
      "Sustainable and reusable water bottle made from recycled materials.",
    price_points: 15,
    images: [
      "https://i.pinimg.com/564x/c8/03/6a/c8036a4699f53dfc15ec88cafb2dc512.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS13keLQVbsGletMs9CZ1ZWRuf6hwecRd7JIkwVKI26Q-XfkraKFslSfVgCjUu8DclPyhU&usqp=CAU",
    ],
    created_at: "2025-08-10T14:10:00Z",
  },
  {
    id: "3f4g5h6i",
    name: "Bamboo Cutlery Set",
    description:
      "Portable and eco-friendly bamboo cutlery set, perfect for picnics and travel.",
    price_points: 20,
    images: [
      "https://envaplax.com/cdn/shop/files/BambooCutlerySet_1__1.jpg?v=1704435503&width=1200",
      "https://m.media-amazon.com/images/I/81JPUvZ3AhS._UF894,1000_QL80_.jpg",
    ],
    created_at: "2025-08-25T12:30:00Z",
  },
  {
    id: "4h5i6j7k",
    name: "Compostable Plates",
    description:
      "Biodegradable plates made from sugarcane fiber. Perfect for eco-friendly parties.",
    price_points: 30,
    images: [
      "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/6729b50f3c620a03c399722f/round-6-bulk-640x640.png",
      "https://m.media-amazon.com/images/I/81RTpU5hr5L.jpg",
    ],
    created_at: "2025-09-03T09:50:00Z",
  },
  {
    id: "5j6k7l8m",
    name: "Recycled Paper Notebooks",
    description:
      "Eco-friendly notebooks made from 100% recycled paper. Perfect for jotting down your ideas.",
    price_points: 12,
    images: [
      "https://www.pack-mate.in/cdn/shop/files/packmate-spiral-notebook-ruled-pack-of-5-made-from-100-recycled-paper.webp?v=1728120906",
      "https://m.media-amazon.com/images/I/817mFy4yYkL._UF1000,1000_QL80_.jpg",
    ],
    created_at: "2025-07-20T16:10:00Z",
  },
  {
    id: "6k7l8m9n",
    name: "Eco-Friendly Laundry Detergent",
    description:
      "Biodegradable laundry detergent that’s tough on stains but gentle on the planet.",
    price_points: 18,
    images: [
      "https://m.media-amazon.com/images/I/61Ii0ySBKOL._UF1000,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/61gj7Rz8Y+L._UF1000,1000_QL80_.jpg",
    ],
    created_at: "2025-06-15T10:00:00Z",
  },
  {
    id: "7l8m9n0o",
    name: "Sustainable Beach Towel",
    description:
      "Made from recycled plastic bottles, this beach towel is both soft and eco-friendly.",
    price_points: 40,
    images: [
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTTbwu_chNnQMCPmC47UWpvQDNvfoANy4ECYDD4MQreBndVrsDVzw8P6xNamKwwYCyDemuzKISEx4yxQ60YkGfX2Oq3Pm-RStzY8VDo-Ogy6XK80bNytyWc",
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTYqi7-yb8KhYpm7H3T5JSapfb5vBLGcJHld7SDANGjiBnbbVH8QUNUUIf1keR6PiCWVY-dXoQfQum7I3URlceKi13T-3s8IthFTeUDoUGlVYldO8sudWx_Hw",
    ],
    created_at: "2025-07-25T12:45:00Z",
  },
  {
    id: "8m9n0o1p",
    name: "Recycled Plastic Phone Case",
    description:
      "Phone case made from recycled plastic bottles. Protect your phone while protecting the planet.",
    price_points: 22,
    images: [
      "https://m.media-amazon.com/images/I/61AGSu9b8jL._UF1000,1000_QL80_.jpg",
      "https://m.media-amazon.com/images/I/51QaAmutntL._UF1000,1000_QL80_.jpg",
    ],
    created_at: "2025-05-19T13:00:00Z",
  },
];


export default function EcoProducts() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const [sortBy, setSortBy] = useState("points"); // "points" or "name"
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [alertShown, setAlertShown] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px"; // prevent layout shift
    } else {
      // Small delay to allow modal close animation to complete
      const timer = setTimeout(() => {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
        setMainImageIndex(0);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedProduct]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = sampleProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === "points") {
        if (sortOrder === "asc") {
          return a.price_points - b.price_points;
        } else {
          return b.price_points - a.price_points;
        }
      } else if (sortBy === "name") {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOrder === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      }
      return 0;
    });

    return filtered;
  }, [searchTerm, sortOrder, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder, sortBy]);

  // Cart functions
  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Product already in cart, increase quantity
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // New product, check limit
        if (prevItems.length >= 3) {
          // Limit reached, show alert only once
          if (!alertShown) {
            setAlertShown(true);
            alert('You can only add up to 3 different products per order');
            // Reset alert flag after a short delay
            setTimeout(() => setAlertShown(false), 2000);
          }
          return prevItems;
        }
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleBuyNow = (product) => {
    // Reset body styles before navigating to prevent scroll issues
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    navigate("/checkout", { state: { singleProduct: { ...product, quantity: 1 } } });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen max-h-fit relative overflow-hidden font-sans px-4 py-12 flex flex-col" style={{
        background: 'linear-gradient(135deg, #dcfce7 0%, #d1fae5 50%, #bbf7d0 100%)'
      }}>
        <div className="relative mb-8">
          {/* Cart Icon - Top Right */}
          <button
            onClick={() => setShowCart(true)}
            className="absolute top-0 right-4 sm:right-6 md:right-8 z-20 p-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
            aria-label="View cart"
          >
            <FaShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {getCartItemCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                {getCartItemCount()}
              </span>
            )}
          </button>

          {/* Header */}
          <div className="text-center pr-20 sm:pr-24 md:pr-28">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-800 tracking-tight drop-shadow-md leading-tight">
              Eco-Friendly Products
            </h1>
          </div>
        </div>

        {/* Search and Sort Controls */}
        <div className="max-w-7xl mx-auto px-4 mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center relative z-10">
          <div className="relative flex-1 min-w-0">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search eco-friendly products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm text-gray-700 text-base font-normal placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <span className="text-green-700 font-medium text-sm whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-4 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm text-green-700 text-sm font-medium min-w-[110px] flex-1 sm:flex-none"
              >
                <option value="points">Points</option>
                <option value="name">Name</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 px-4 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-sm text-sm font-semibold whitespace-nowrap ml-2"
              >
                {sortBy === "name" ? (
                  sortOrder === "asc" ? <FaSortAlphaUp className="w-4 h-4" /> : <FaSortAlphaDown className="w-4 h-4" />
                ) : (
                  sortOrder === "asc" ? <FaSortAmountUp className="w-4 h-4" /> : <FaSortAmountDown className="w-4 h-4" />
                )}
                {sortBy === "name" ? (sortOrder === "asc" ? "A-Z" : "Z-A") : (sortOrder === "asc" ? "Low-High" : "High-Low")}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`grid px-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 transition-all duration-300 relative z-10 ${
            selectedProduct ? "blur-sm pointer-events-none select-none" : ""
          }`}
          style={{
            maxHeight: selectedProduct ? "calc(100vh - 200px)" : "none",
            overflowY: selectedProduct ? "hidden" : "visible",
            minHeight: selectedProduct ? "400px" : "auto"
          }}
        >
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-2 transition-all duration-300 p-4 flex flex-col border border-gray-100 hover:border-green-300 group overflow-hidden"
              onClick={() => setSelectedProduct(product)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && setSelectedProduct(product)}
            >
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 md:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  <FaLeaf className="w-3 h-3 inline mr-1" />
                  {product.price_points}
                </div>
              </div>
              <h2 className="text-lg font-bold text-green-800 mb-2 truncate group-hover:text-green-700 transition-colors leading-tight">
                {product.name}
              </h2>
              <p className="text-gray-600 flex-grow mb-4 leading-relaxed text-sm line-clamp-2 font-normal">
                {product.description}
              </p>
              <div className="mt-auto flex items-center justify-center">
                <div className="text-green-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <span>View Details</span>
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex justify-center items-center gap-4 mt-8 mb-4 relative z-10 transition-opacity duration-300 ${
            selectedProduct ? "opacity-30 pointer-events-none" : "opacity-100"
          }`}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
              }`}
            >
              <FaChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-green-800 font-bold px-3 py-1 bg-green-50 rounded-full">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
              }`}
            >
              Next
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Product detail modal overlay */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-10 overflow-y-auto"
            style={{ 
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain"
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedProduct(null);
              }
            }}
          >
            <div
              className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] flex flex-col md:flex-row overflow-hidden border border-green-100"
              style={{ minWidth: "280px", maxWidth: "100vw" }}
            >
              {/* Left: Product Image and Thumbnails */}
              <div className="relative md:w-1/2 bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
                <div className="w-full flex items-center justify-center mb-4">
                  <img
                    src={selectedProduct.images[mainImageIndex]}
                    alt={`${selectedProduct.name} main`}
                    className="rounded-lg sm:rounded-xl w-full max-w-[250px] h-[200px] sm:max-w-[300px] sm:h-[250px] md:max-w-[400px] md:h-[300px] lg:max-w-[500px] lg:h-[350px] object-contain drop-shadow-lg"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 px-2 sm:px-0 max-w-full">
                  {selectedProduct.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setMainImageIndex(i)}
                      className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg border-2 transition-all duration-200 ${
                        i === mainImageIndex
                          ? "border-green-600 scale-110 shadow-md"
                          : "border-transparent hover:border-green-400 hover:scale-105"
                      }`}
                      style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        minWidth: '48px',
                        minHeight: '48px'
                      }}
                      aria-label={`Select image ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center min-h-[300px] sm:min-h-[400px] md:min-h-[500px] max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="ml-auto mb-4 sm:mb-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                  aria-label="Close product details"
                >
                  ×
                </button>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-3 sm:mb-4 leading-tight">
                  {selectedProduct.name}
                </h2>

                <div className="mb-4 sm:mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                    <FaLeaf className="w-4 h-4 mr-2" />
                    {selectedProduct.price_points} Green Points
                  </span>
                  <p className="text-green-500 text-xs mt-1 font-normal">Required to purchase</p>
                </div>

                <p className="text-gray-700 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed font-normal">
                  {selectedProduct.description}
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
                  {isInCart(selectedProduct.id) ? (
                    <button 
                      onClick={() => {
                        removeFromCart(selectedProduct.id);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-red-600 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-md hover:bg-red-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-60 transform hover:scale-105 tracking-wide uppercase"
                    >
                      REMOVE FROM CART
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-green-600 text-white py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-md hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-60 transform hover:scale-105 tracking-wide uppercase"
                    >
                      ADD TO CART
                    </button>
                  )}
                  <button
                    onClick={() => handleBuyNow(selectedProduct)}
                    className="flex-1 border-2 border-green-600 py-3 sm:py-4 rounded-lg font-bold text-green-600 hover:bg-green-50 transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-60 tracking-wide uppercase"
                  >
                    BUY IT NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cart Modal */}
        {showCart && (
          <Cart
            cartItems={cartItems}
            onClose={() => setShowCart(false)}
            onRemoveFromCart={removeFromCart}
            onUpdateQuantity={updateQuantity}
            onClearCart={clearCart}
          />
        )}
      </div>
    </div>
  );
}