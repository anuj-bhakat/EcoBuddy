import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px"; // prevent layout shift
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      setMainImageIndex(0);
      setQuantity(1);
    }
  }, [selectedProduct]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen max-h-fit bg-green-50 font-sans px-4 py-12 relative flex flex-col">
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-10 text-center tracking-wide drop-shadow-md">
          Eco-Friendly Products
        </h1>

        <div
          className={`grid px-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 transition-filter duration-300 ${
            selectedProduct ? "blur-sm pointer-events-none select-none" : ""
          }`}
          style={{
            maxHeight: selectedProduct ? "calc(100vh - 6rem)" : "auto",
            overflowY: selectedProduct ? "hidden" : "visible",
          }}
        >
          {sampleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col"
              onClick={() => setSelectedProduct(product)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === "Enter" && setSelectedProduct(product)}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="rounded-md w-full h-40 md:h-48 object-cover mb-3 md:mb-4 drop-shadow-sm"
                loading="lazy"
              />
              <h2 className="text-lg md:text-xl font-semibold text-green-800 mb-2 truncate">
                {product.name}
              </h2>
              <p className="text-gray-700 flex-grow mb-3 md:mb-5 leading-relaxed text-sm md:text-base">
                {product.description}
              </p>
              <div className="mt-auto text-green-700 font-semibold text-base md:text-lg">
                Green Points: {product.price_points}
              </div>
            </div>
          ))}
        </div>

        {/* Product detail modal overlay */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 overflow-y-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row overflow-y-auto"
              style={{ minWidth: "300px", maxWidth: "100vw" }}
            >
              {/* Left: Product Image and Thumbnails */}
              <div className="relative md:w-1/2 bg-green-100 p-6 flex flex-col items-center justify-center">
                <img
                  src={selectedProduct.images[mainImageIndex]}
                  alt={`${selectedProduct.name} main`}
                  className="rounded-lg w-full max-h-[28rem] object-contain drop-shadow-lg"
                  loading="lazy"
                />
                <div className="flex space-x-4 mt-4 overflow-x-auto">
                  {selectedProduct.images.map((img, i) => (
                    <button
                      key={img}
                      onClick={() => setMainImageIndex(i)}
                      className={`w-14 h-14 rounded-md border-2 transition ${
                        i === mainImageIndex
                          ? "border-green-700"
                          : "border-transparent hover:border-green-300"
                      }`}
                      style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                      aria-label={`Select image ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Product Details */}
              <div className="md:w-1/2 p-8 flex flex-col">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="ml-auto mb-6 text-green-700 font-semibold hover:underline cursor-pointer focus:outline-none text-xl"
                  aria-label="Close product details"
                >
                  ×
                </button>

                <h2 className="text-3xl font-serif font-semibold text-green-900 mb-4 leading-tight">
                  {selectedProduct.name}
                </h2>

                <div className="text-green-700 font-semibold text-xl mb-6">
                  Green Points: {selectedProduct.price_points}
                </div>

                <p className="text-gray-800 text-base mb-8 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Quantity selector */}
                <div className="flex items-center space-x-4 mb-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="border border-green-700 text-green-700 font-bold px-4 py-2 rounded hover:bg-green-100 focus:outline-none select-none"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min="1"
                    className="border border-gray-400 rounded w-16 text-center py-1 outline-none"
                    aria-label="Enter quantity"
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 1) setQuantity(val);
                    }}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="border border-green-700 text-green-700 font-bold px-4 py-2 rounded hover:bg-green-100 focus:outline-none select-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 flex-wrap">
                  <button className="flex-1 bg-green-700 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-green-800 transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-60">
                    ADD TO CART
                  </button>
                  <button className="flex-1 border border-green-700 py-3 rounded-lg font-semibold text-green-700 hover:bg-green-50 transition duration-200 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-60">
                    BUY IT NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}