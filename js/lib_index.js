  // Render featured products (pick first 8)
  const products = getProducts();
  const featured = products.filter(p => p.isNew || p.sale > 0).slice(0, 8);
  const extra = products.filter(p => !p.isNew && p.sale === 0).slice(0, 8 - featured.length);
  const shown = [...featured, ...extra].slice(0, 8);

  const grid = document.getElementById('featured-grid');
  grid.innerHTML = shown.map(p => {
    const finalPrice = p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;
    const badge = p.sale > 0
      ? `<span class="badge-sale">-${p.sale}%</span>`
      : p.isNew ? `<span class="badge-new">MỚI</span>` : '';
    const outBadge = !p.available ? `<span class="badge-out">Hết</span>` : '';
    return `
      <div class="product-card" onclick="goToProduct(${p.id})" style="cursor:pointer">
        ${badge}${outBadge}
        <div class="product-img">
          ${p.img ? `<img src="assets/${p.img}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span class="img-fallback" style="display:none;position:absolute">${p.icon}</span>` : `<span class="img-fallback">${p.icon}</span>`}
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
  }).join('');

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
            <div class="cart-item-icon">${p.img ? `<img src="assets/${p.img}" style="width:44px;height:44px;object-fit:cover;border-radius:10px;">` : p.icon}</div>
            <div class="cart-item-info">
              <div class="cart-item-name">${p.name}</div>
              <div class="cart-item-price">${formatPrice(fp)}</div>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
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
    if (item.qty <= 0) {
      const idx = cart.indexOf(item);
      cart.splice(idx, 1);
    }
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

  updateCartBadge();