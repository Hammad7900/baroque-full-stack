import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Menu, X, Search, ChevronRight } from 'lucide-react';

const AppContext = createContext();

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products').then(res => setProducts(res.data)).catch(console.error);
  }, []);

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
    setIsCartOpen(true);
  };
  const removeFromCart = (cartId) => setCart(cart.filter(item => item.cartId !== cartId));
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <AppContext.Provider value={{ products, cart, addToCart, removeFromCart, cartTotal, setIsCartOpen }}>
      <Router>
        <div className="min-h-screen flex flex-col font-sans">
          {/* Navbar */}
          <header className="sticky top-0 bg-white/95 backdrop-blur z-40 border-b border-gray-100 px-4 md:px-10 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 cursor-pointer" />
              <div className="hidden md:flex gap-6 text-xs uppercase tracking-widest font-semibold">
                <Link to="/" className="hover:text-gray-500">Home</Link>
                <Link to="/collections/unstitched" className="hover:text-gray-500">Unstitched</Link>
                <Link to="/collections/formals" className="hover:text-gray-500">Formals</Link>
                <Link to="/collections/ready-to-wear" className="hover:text-gray-500">Pret</Link>
              </div>
            </div>
            <Link to="/" className="text-3xl font-serif tracking-[0.2em] font-bold uppercase text-black">Baroque</Link>
            <div className="flex gap-4 items-center">
              <Search className="w-5 h-5 cursor-pointer hidden md:block" />
              <div className="relative cursor-pointer" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag className="w-6 h-6" />
                {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">{cart.length}</span>}
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections/:category" element={<Collections />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-black text-white py-12 px-6 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h2 className="text-2xl font-serif tracking-widest mb-4">BAROQUE</h2>
                <p className="text-sm text-gray-400">Premium clothing brand offering luxury unstitched, pret, and formals.</p>
              </div>
              <div className="flex flex-col gap-2 text-sm text-gray-300">
                <h4 className="font-bold text-white mb-2 uppercase">Information</h4>
                <Link to="/">About Us</Link>
                <Link to="/">Delivery Policy</Link>
                <Link to="/">Track Order</Link>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4 uppercase">Newsletter</h4>
                <div className="flex"><input type="email" placeholder="Email Address" className="px-4 py-2 w-full text-black"/><button className="bg-gray-800 px-4 py-2 uppercase text-sm">Subscribe</button></div>
              </div>
            </div>
          </footer>

          {/* Cart Sidebar */}
          {isCartOpen && (
            <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
              <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in">
                <div className="flex justify-between items-center p-6 border-b">
                  <h2 className="text-lg font-serif uppercase tracking-widest">Shopping Cart ({cart.length})</h2>
                  <X className="w-6 h-6 cursor-pointer" onClick={() => setIsCartOpen(false)} />
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {cart.length === 0 ? <p className="text-gray-500 text-center mt-10">Your cart is empty.</p> : cart.map((item) => (
                    <div key={item.cartId} className="flex gap-4 mb-6 relative">
                      <img src={item.images[0]} className="w-24 h-32 object-cover bg-gray-100" />
                      <div className="flex-1">
                        <h4 className="text-sm uppercase font-medium">{item.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                        <p className="text-sm font-semibold mt-2">PKR {item.price.toLocaleString()}</p>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-xs text-red-500 underline mt-4">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                {cart.length > 0 && (
                  <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-between font-bold text-lg mb-4"><span>Subtotal:</span><span>PKR {cartTotal.toLocaleString()}</span></div>
                    <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                      <button className="bg-black text-white w-full py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition">Proceed to Checkout</button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Router>
    </AppContext.Provider>
  );
}

// --- PAGES ---

function Home() {
  const { products } = useContext(AppContext);
  const featured = products.slice(0, 4);

  return (
    <div>
      <div className="w-full h-[70vh] bg-gray-200 relative flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="relative z-10 text-center text-white bg-black/30 p-10 backdrop-blur-sm">
          <h2 className="text-5xl font-serif mb-4 tracking-wider">WINTER '26</h2>
          <Link to="/collections/unstitched" className="border border-white px-8 py-3 uppercase text-sm tracking-widest hover:bg-white hover:text-black transition">Shop Now</Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-serif uppercase tracking-widest">Featured Arrivals</h3>
          <p className="text-gray-500 mt-2">Explore the finest collections of the season.</p>
        </div>
        <ProductGrid products={featured} />
        <div className="text-center mt-12">
          <Link to="/collections/all" className="text-sm font-semibold border-b border-black pb-1 uppercase tracking-widest">View All Products</Link>
        </div>
      </div>
    </div>
  );
}

function Collections() {
  const { category } = useParams();
  const { products } = useContext(AppContext);
  
  let filtered = products;
  if(category !== 'all') {
    const formattedCat = category.replace('-', ' ').toLowerCase();
    filtered = products.filter(p => p.category.toLowerCase() === formattedCat);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-2 text-sm text-gray-500 uppercase tracking-wider">
        <Link to="/">Home</Link> <ChevronRight className="w-4 h-4"/> <span className="text-black font-semibold">{category.replace('-', ' ')}</span>
      </div>
      <h2 className="text-4xl font-serif uppercase tracking-widest mb-10">{category.replace('-', ' ')}</h2>
      {filtered.length === 0 ? <p className="text-gray-500">No products found in this category.</p> : <ProductGrid products={filtered} />}
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(AppContext);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/products/${id}`).then(res => setProduct(res.data)).catch(console.error);
  }, [id]);

  if (!product) return <div className="p-20 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
      <div className="md:w-1/2">
        <img src={product.images[0]} className="w-full h-auto object-cover bg-gray-100" alt={product.title} />
      </div>
      <div className="md:w-1/2 flex flex-col justify-center">
        <p className="text-sm text-gray-500 uppercase tracking-widest mb-2">{product.category}</p>
        <h1 className="text-3xl font-serif uppercase tracking-wider mb-4">{product.title}</h1>
        <p className="text-xl font-semibold mb-6">PKR {product.price.toLocaleString()}</p>
        <div className="w-full h-px bg-gray-200 mb-6"></div>
        <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
        <p className="text-sm mb-6"><span className="font-semibold uppercase text-xs">Fabric:</span> {product.fabric}</p>
        <button onClick={() => addToCart(product)} className="w-full bg-black text-white py-4 uppercase tracking-widest font-semibold hover:bg-gray-800 transition">Add to Cart</button>
      </div>
    </div>
  );
}

function Checkout() {
  const { cart, cartTotal } = useContext(AppContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '' });

  const submitOrder = async (e) => {
    e.preventDefault();
    if(cart.length === 0) return alert('Cart is empty');
    try {
      await axios.post('http://localhost:5000/api/orders', { customerInfo: form, items: cart, totalAmount: cartTotal });
      alert('Order placed successfully! Redirecting home...');
      window.location.href = '/';
    } catch (e) { alert('Order failed'); }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-serif uppercase tracking-widest mb-8 border-b pb-4">Secure Checkout</h2>
      <div className="flex flex-col md:flex-row gap-10">
        <form onSubmit={submitOrder} className="md:w-2/3 flex flex-col gap-4">
          <h3 className="font-semibold uppercase tracking-wider mb-2">Shipping Details</h3>
          <input type="text" placeholder="Full Name" required className="border border-gray-300 p-3 outline-none focus:border-black" onChange={e => setForm({...form, name: e.target.value})}/>
          <input type="tel" placeholder="Phone Number" required className="border border-gray-300 p-3 outline-none focus:border-black" onChange={e => setForm({...form, phone: e.target.value})}/>
          <input type="text" placeholder="City" required className="border border-gray-300 p-3 outline-none focus:border-black" onChange={e => setForm({...form, city: e.target.value})}/>
          <textarea placeholder="Full Address" required className="border border-gray-300 p-3 outline-none focus:border-black" rows="3" onChange={e => setForm({...form, address: e.target.value})}></textarea>
          <button type="submit" className="bg-black text-white py-4 uppercase tracking-widest font-semibold mt-4">Place Order</button>
        </form>
        <div className="md:w-1/3 bg-gray-50 p-6 h-fit">
          <h3 className="font-semibold uppercase tracking-wider mb-4 border-b pb-2">Order Summary</h3>
          {cart.map(item => (
            <div key={item.cartId} className="flex justify-between text-sm mb-3"><span>{item.title}</span><span>PKR {item.price}</span></div>
          ))}
          <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg"><span>Total</span><span>PKR {cartTotal.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTS ---

function ProductGrid({ products }) {
  const { addToCart } = useContext(AppContext);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((item) => (
        <div key={item._id} className="flex flex-col group">
          <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden relative mb-4">
            <Link to={`/product/${item._id}`}>
              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" />
            </Link>
            <button onClick={() => addToCart(item)} className="absolute bottom-4 left-4 right-4 bg-white/95 text-black py-3 uppercase text-xs tracking-widest font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">Add to Cart</button>
          </div>
          <Link to={`/product/${item._id}`}>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">{item.category}</p>
            <h3 className="text-sm font-medium text-black uppercase hover:text-gray-600 transition">{item.title}</h3>
            <p className="text-sm text-gray-800 mt-1">PKR {item.price.toLocaleString()}</p>
          </Link>
        </div>
      ))}
    </div>
  );
}
