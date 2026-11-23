 
import { useMemo, useState } from 'react'
import './App.css'

const products = [
  { id: 1, name: 'Premium Cotton T-Shirt', category: 'Men', price: 599, oldPrice: 1199, rating: '4.5', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', description: 'A comfortable premium cotton T-shirt for everyday wear.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 2, name: 'Elegant Summer Dress', category: 'Women', price: 999, oldPrice: 1999, rating: '4.8', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600', description: 'An elegant summer dress with a stylish and comfortable fit.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 3, name: 'Running Sports Shoes', category: 'Footwear', price: 1499, oldPrice: 2999, rating: '4.6', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', description: 'Lightweight sports shoes designed for everyday comfort.', sizes: ['7', '8', '9', '10'] },
  { id: 4, name: 'Premium Handbag', category: 'Accessories', price: 799, oldPrice: 1599, rating: '4.4', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', description: 'A stylish handbag for everyday use and special occasions.', sizes: ['FREE SIZE'] },
  { id: 5, name: 'Classic White Shirt', category: 'Men', price: 899, oldPrice: 1799, rating: '4.3', image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600', description: 'A classic white shirt that works for casual and formal looks.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 6, name: 'Stylish Sunglasses', category: 'Accessories', price: 499, oldPrice: 999, rating: '4.5', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600', description: 'Modern sunglasses to complete your everyday style.', sizes: ['FREE SIZE'] },
  { id: 7, name: 'Denim Fashion Jacket', category: 'Men', price: 1299, oldPrice: 2499, rating: '4.7', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600', description: 'A versatile denim jacket with a timeless look.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 8, name: 'Designer Women Bag', category: 'Accessories', price: 1199, oldPrice: 2299, rating: '4.6', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', description: 'A designer-inspired bag for a polished everyday look.', sizes: ['FREE SIZE'] }
]

const categories = ['All', 'Men', 'Women', 'Footwear', 'Accessories']

function App() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOnly, setWishlistOnly] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedQuantity, setSelectedQuantity] = useState(1)

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const matchesWishlist = !wishlistOnly || wishlist.includes(product.id)
      return matchesSearch && matchesCategory && matchesWishlist
    })
  }, [search, activeCategory, wishlist, wishlistOnly])

  const openProduct = product => {
    setSelectedProduct(product)
    setSelectedSize('')
    setSelectedQuantity(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToProducts = () => {
    setSelectedProduct(null)
    setTimeout(() => {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const addToCart = (product, size, quantity) => {
    setCart(currentCart => {
      const existing = currentCart.find(item => item.id === product.id && item.size === size)

      if (existing) {
        return currentCart.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [...currentCart, { ...product, size, quantity }]
    })
  }

  const changeQuantity = (id, size, amount) => {
    setCart(currentCart =>
      currentCart
        .map(item =>
          item.id === id && item.size === size
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter(item => item.quantity > 0)
    )
  }

  const toggleWishlist = id => {
    setWishlist(current =>
      current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id]
    )
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <div className="app">
      <div className="announcement">
        FREE SHIPPING ON ORDERS ABOVE ₹999 <span>|</span> EXTRA 10% OFF ON FIRST ORDER
      </div>

      <header className="navbar">
        <a href="#" className="logo" onClick={e => {
          e.preventDefault()
          setSelectedProduct(null)
          setActiveCategory('All')
          setWishlistOnly(false)
          setSearch('')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}>
          MYNTRA<span>.</span>
        </a>

        <nav className="nav-links">
          {['Men', 'Women', 'All', 'Accessories', 'Footwear'].map(category => (
            <button key={category} onClick={() => {
              setActiveCategory(category)
              setWishlistOnly(false)
              scrollToProducts()
            }}>
              {category === 'All' ? 'KIDS' : category.toUpperCase()}
            </button>
          ))}
        </nav>

        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="search"
            placeholder="Search for products, brands and more"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setWishlistOnly(false)
              setSelectedProduct(null)
            }}
          />
        </div>

        <div className="nav-actions">
          <button className="nav-action" onClick={() => {
            setWishlistOnly(true)
            setActiveCategory('All')
            setSelectedProduct(null)
            scrollToProducts()
          }}>
            <span className="nav-symbol">♡</span>
            <small>Wishlist</small>
            {wishlist.length > 0 && <b className="nav-count">{wishlist.length}</b>}
          </button>

          <button className="nav-action" onClick={() => setCartOpen(true)}>
            <span className="nav-symbol">♧</span>
            <small>Bag</small>
            {cartCount > 0 && <b className="nav-count">{cartCount}</b>}
          </button>
        </div>
      </header>

      {selectedProduct ? (
        <main className="detail-page">
          <button className="back-shopping" onClick={scrollToProducts}>
            ← BACK TO SHOPPING
          </button>

          <div className="detail-layout">
            <div className="detail-image-box">
              <img src={selectedProduct.image} alt={selectedProduct.name} />
            </div>

            <div className="detail-info">
              <span className="eyebrow">{selectedProduct.category} COLLECTION</span>
              <h1>{selectedProduct.name}</h1>

              <div className="detail-rating">
                ★ {selectedProduct.rating} <span>| Customer Rating</span>
              </div>

              <div className="detail-price">
                <strong>₹{selectedProduct.price.toLocaleString('en-IN')}</strong>
                <del>₹{selectedProduct.oldPrice.toLocaleString('en-IN')}</del>
                <span>
                  {Math.round((1 - selectedProduct.price / selectedProduct.oldPrice) * 100)}% OFF
                </span>
              </div>

              <p className="tax-note">Inclusive of all taxes</p>
              <div className="detail-divider" />

              <h3>Product Description</h3>
              <p className="detail-description">{selectedProduct.description}</p>

              <h3 className="size-title">Select Size</h3>
              <div className="size-options">
                {selectedProduct.sizes.map(size => (
                  <button
                    key={size}
                    className={selectedSize === size ? 'size-selected' : ''}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <h3 className="quantity-title">Select Quantity</h3>
              <div className="detail-quantity">
                <button onClick={() => setSelectedQuantity(q => Math.max(1, q - 1))}>−</button>
                <span>{selectedQuantity}</span>
                <button onClick={() => setSelectedQuantity(q => Math.min(10, q + 1))}>+</button>
              </div>

              <div className="detail-buttons">
                <button className="detail-add-cart" onClick={() => {
                  if (!selectedSize) {
                    alert('Please select a size first.')
                    return
                  }
                  addToCart(selectedProduct, selectedSize, selectedQuantity)
                  setCartOpen(true)
                }}>
                  ADD TO BAG
                </button>

                <button
                  className={`detail-wishlist ${wishlist.includes(selectedProduct.id) ? 'liked' : ''}`}
                  onClick={() => toggleWishlist(selectedProduct.id)}
                >
                  {wishlist.includes(selectedProduct.id) ? '♥ ADDED TO WISHLIST' : '♡ WISHLIST'}
                </button>
              </div>

              <div className="delivery-info">
                <strong>Delivery & Services</strong>
                <p>✓ 100% Original Products</p>
                <p>✓ Easy Returns within 7 days</p>
                <p>✓ Free delivery on orders above ₹999</p>
              </div>
            </div>
          </div>
        </main>
      ) : (
        <>
          <section className="hero">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <span className="hero-tag">THE FASHION EVENT OF THE YEAR</span>
              <h1>STYLE THAT<br /><span>DEFINES YOU.</span></h1>
              <p>Discover the latest fashion trends. Upgrade your wardrobe with styles you love.</p>
              <button className="hero-btn" onClick={scrollToProducts}>
                EXPLORE COLLECTION <span>→</span>
              </button>
              <div className="hero-offer">
                <strong>50%</strong>
                <span>UP TO OFF</span>
              </div>
            </div>
          </section>

          <section className="benefits">
            <div><span>✦</span><p><strong>Premium Quality</strong><small>Fashion that lasts</small></p></div>
            <div><span>↗</span><p><strong>Latest Trends</strong><small>New styles every week</small></p></div>
            <div><span>◇</span><p><strong>Easy Shopping</strong><small>Simple and convenient</small></p></div>
            <div><span>✓</span><p><strong>Great Prices</strong><small>Style within your budget</small></p></div>
          </section>

          <section className="categories-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">FIND YOUR STYLE</span>
                <h2>SHOP BY CATEGORY</h2>
              </div>
              <p>Explore our curated collections</p>
            </div>

            <div className="category-grid">
              {[
                ['Men', "MEN'S WEAR", 'category-men'],
                ['Women', "WOMEN'S WEAR", 'category-women'],
                ['Footwear', 'FOOTWEAR', 'category-shoes'],
                ['Accessories', 'ACCESSORIES', 'category-accessories']
              ].map(([category, label, className], index) => (
                <button
                  key={category}
                  className={`category-tile ${className}`}
                  onClick={() => {
                    setActiveCategory(category)
                    setWishlistOnly(false)
                    scrollToProducts()
                  }}
                >
                  <span>0{index + 1} / COLLECTION</span>
                  <strong>{label}</strong>
                  <small>EXPLORE →</small>
                </button>
              ))}
            </div>
          </section>

          <section className="products-section" id="products">
            <div className="section-heading product-heading">
              <div>
                <span className="eyebrow">HANDPICKED FOR YOU</span>
                <h2>{wishlistOnly ? 'MY WISHLIST' : 'TRENDING COLLECTION'}</h2>
              </div>
              <p>{filteredProducts.length} PRODUCTS FOUND</p>
            </div>

            <div className="filter-bar">
              <div className="filter-buttons">
                {categories.map(item => (
                  <button
                    key={item}
                    className={activeCategory === item ? 'filter-active' : ''}
                    onClick={() => {
                      setActiveCategory(item)
                      setWishlistOnly(false)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {wishlistOnly && (
                <button className="clear-filter" onClick={() => setWishlistOnly(false)}>
                  SHOW ALL PRODUCTS ✕
                </button>
              )}
            </div>

            <div className="product-grid">
              {filteredProducts.map(product => (
                <article
                  className="product-card"
                  key={product.id}
                  onClick={() => openProduct(product)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter') openProduct(product)
                  }}
                >
                  <div className="product-image-wrap">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <span className="discount-label">
                      {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                    </span>
                    <button
                      className={`wishlist-button ${wishlist.includes(product.id) ? 'liked' : ''}`}
                      onClick={e => {
                        e.stopPropagation()
                        toggleWishlist(product.id)
                      }}
                      aria-label="Toggle wishlist"
                    >
                      {wishlist.includes(product.id) ? '♥' : '♡'}
                    </button>
                  </div>

                  <div className="product-details">
                    <div className="product-topline">
                      <span>{product.category}</span>
                      <span className="rating">★ {product.rating}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <div className="product-pricing">
                      <strong>₹{product.price}</strong>
                      <del>₹{product.oldPrice}</del>
                      <span>({Math.round((1 - product.price / product.oldPrice) * 100)}% OFF)</span>
                    </div>
                    <button className="add-to-bag" onClick={e => {
                      e.stopPropagation()
                      openProduct(product)
                    }}>
                      VIEW DETAILS →
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="no-results">
                <h3>No products found</h3>
                <p>Try another search or category.</p>
                <button onClick={() => {
                  setSearch('')
                  setActiveCategory('All')
                  setWishlistOnly(false)
                }}>
                  CLEAR FILTERS
                </button>
              </div>
            )}
          </section>

          <section className="newsletter">
            <div>
              <span className="eyebrow">STAY IN STYLE</span>
              <h2>GET THE LATEST FASHION UPDATES</h2>
              <p>Discover new collections and exclusive offers.</p>
            </div>
            <button onClick={scrollToProducts}>EXPLORE NOW →</button>
          </section>

          <footer className="footer">
            <div className="footer-main">
              <div className="footer-brand">
                <h2>MYNTRA<span>.</span></h2>
                <p>Bringing fashion closer to you. Discover your style and express yourself.</p>
              </div>
              <div><h3>SHOP</h3><p>Men's Fashion</p><p>Women's Fashion</p><p>Footwear</p><p>Accessories</p></div>
              <div><h3>HELP</h3><p>Contact Us</p><p>FAQs</p><p>Shipping Information</p><p>Returns</p></div>
              <div><h3>ABOUT</h3><p>Our Story</p><p>Privacy Policy</p><p>Terms & Conditions</p></div>
            </div>
            <div className="footer-bottom">
              <p>© 2026 MYNTRA CLONE. MADE FOR LEARNING.</p>
              <p>DESIGNED WITH STYLE ♥</p>
            </div>
          </footer>
        </>
      )}

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <div>
                <span className="eyebrow">YOUR SHOPPING</span>
                <h2>MY BAG ({cartCount})</h2>
              </div>
              <button onClick={() => setCartOpen(false)}>✕</button>
            </div>

            {cart.length === 0 ? (
              <div className="empty-cart">
                <span>♧</span>
                <h3>Your bag is empty!</h3>
                <p>Looks like you haven't added anything yet.</p>
                <button onClick={() => setCartOpen(false)}>CONTINUE SHOPPING</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div className="cart-item" key={`${item.id}-${item.size}`}>
                      <img src={item.image} alt={item.name} />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <strong>₹{item.price}</strong>
                        <small>Size: {item.size}</small>
                        <div className="quantity-control">
                          <button onClick={() => changeQuantity(item.id, item.size, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => changeQuantity(item.id, item.size, 1)}>+</button>
                        </div>
                      </div>
                      <button className="remove-item" onClick={() => setCart(current =>
                        current.filter(product => !(product.id === item.id && product.size === item.size))
                      )}>✕</button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Total Amount</span>
                    <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                  </div>
                  <button onClick={() => alert('Checkout will be connected to the backend in a later step.')}>
                    PROCEED TO CHECKOUT →
                  </button>
                  <small>Demo website · No real payment is processed</small>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}

export default App
