  const CATS = {
    trasua: { label: 'Trà Sữa', icon: '🧋' },
    tradacbiet: { label: 'Trà Đặc Biệt', icon: '🍃' },
    caphe: { label: 'Cà Phê Sáng Tạo', icon: '☕' },
    tuoi: { label: 'Nước Tươi / COCO', icon: '🥥' },
    dam: { label: 'Đặc Biệt Đậm', icon: '🫧' },
  };

  let currentCat = 'all';

  function renderProducts(products) {
    const container = document.getElementById('menu-container');
    const noResult = document.getElementById('no-result');

    if (products.length === 0) {
      container.innerHTML = '';
      noResult.style.display = 'block';
      return;
    }
    noResult.style.display = 'none';

    if (currentCat !== 'all' && currentCat !== 'sale') {
      const catInfo = CATS[currentCat];
      container.innerHTML = `
        <div class="category-section">
          <div class="category-header">
            <span class="category-icon">${catInfo.icon}</span>
            <h2>${catInfo.label}</h2>
          </div>
          <div class="product-grid">${products.map(productCard).join('')}</div>
        </div>`;
    } else {
      // Group by category
      const catOrder = Object.keys(CATS);
      let html = '';
      catOrder.forEach(cat => {
        const catProds = products.filter(p => p.category === cat);
        if (catProds.length === 0) return;
        const catInfo = CATS[cat];
        html += `
          <div class="category-section">
            <div class="category-header">
              <span class="category-icon">${catInfo.icon}</span>
              <h2>${catInfo.label}</h2>
            </div>
            <div class="product-grid">${catProds.map(productCard).join('')}</div>
          </div>`;
      });
      container.innerHTML = html;
    }
  }

  function productCard(p) {
    const finalPrice = p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;
    const badge = p.sale > 0
      ? `<span class="badge-sale">-${p.sale}%</span>`
      : p.isNew ? `<span class="badge-new">MỚI</span>` : '';
    const outBadge = !p.available ? `<span class="badge-out">Hết</span>` : '';
    return `
      <div class="product-card" style="cursor:pointer" onclick="goProduct(${p.id})">
        ${badge}${outBadge}
        <div class="product-img">
          ${p.img ? `<img src="../assets/${p.img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="img-fallback" style="display:none;position:absolute">${p.icon}</span>` : `<span class="img-fallback">${p.icon}</span>`}
        </div>
        <div class="product-info">
          <div class="product-name">${p.name}</div>
          <div class="product-desc">${p.desc}</div>
          <div class="product-price">
            <div>
              <span class="price">${formatPrice(finalPrice)}</span>
              ${p.sale > 0 ? `<span class="price-old">${formatPrice(p.price)}</span>` : ''}
            </div>
            <button class="btn-add" onclick="handleAdd(${p.id})" ${!p.available ? 'disabled' : ''}>
              ${p.available ? '+ Thêm' : 'Hết'}
            </button>
          </div>
        </div>
      </div>`;
  }

  function filterCat(cat, btn) {
    currentCat = cat;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProducts();
  }

  function filterProducts() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    let products = getProducts();
    if (currentCat === 'sale') products = products.filter(p => p.sale > 0);
    else if (currentCat !== 'all') products = products.filter(p => p.category === currentCat);
    if (q) products = products.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
    renderProducts(products);
    applyScrollAnimation();
  }

  function handleAdd(id) {
    addToCart(id);
    showToast('✅ Đã thêm vào giỏ hàng!');
    renderCartSidebar();
  }

  function renderCartSidebar() {
    const cart = getCart();
    const prods = getProducts();
    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:#aaa;padding:40px 0">Giỏ hàng trống 😢</p>';
    } else {
      container.innerHTML = cart.map(item => {
        const p = prods.find(pr => pr.id === item.id);
        if (!p) return '';
        const fp = p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;
        return `
          <div class="cart-item">
            <div class="cart-item-icon">${p.img ? `<img src="../assets/${p.img}" style="width:44px;height:44px;object-fit:cover;border-radius:10px;" onerror="this.outerHTML=p.icon">` : p.icon}</div>
            <div class="cart-item-info">
              <div class="cart-item-name">${p.name}</div>
              <div class="cart-item-price">${formatPrice(fp)}</div>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="changeQty(${p.id},-1)">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${p.id},1)">+</button>
            </div>
          </div>`;
      }).join('');
    }
    document.getElementById('cartTotalEl').textContent = formatPrice(getCartTotal());
  }

  function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
    saveCart(cart);
    updateCartBadge();
    renderCartSidebar();
  }

  function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
  }

  document.querySelector('.nav-cart').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    renderCartSidebar();
  });

  function goProduct(id) { window.location = "product.html?id=" + id; }

  // Scroll animation dùng Intersection Observer
  function applyScrollAnimation() {
    const cards = document.querySelectorAll('.product-card, .category-section');
    if (!cards.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach(card => observer.observe(card));
  }

  filterProducts();
  applyScrollAnimation();
  updateCartBadge();