  function renderSummary() {
    const cart = getCart();
    const prods = getProducts();
    const container = document.getElementById('summaryItems');

    if (cart.length === 0) {
      document.getElementById('orderForm').style.display = 'none';
      document.getElementById('emptyCart').style.display = 'block';
      return;
    }

    container.innerHTML = cart.map(item => {
      const p = prods.find(pr => pr.id === item.id);
      if (!p) return '';
      const fp = p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;
      return `
        <div class="order-item">
          <div class="order-item-icon">${p.img ? `<img src="../assets/${p.img}" style="width:48px;height:48px;object-fit:cover;border-radius:10px;">` : p.icon}</div>
          <div class="order-item-info">
            <div class="order-item-name">${p.name}</div>
            <div class="order-item-sub">x${item.qty}</div>
          </div>
          <div class="order-item-price">${formatPrice(fp * item.qty)}</div>
        </div>`;
    }).join('');

    const sub = getCartTotal();
    const ship = document.getElementById('delivType')?.value === 'pickup' ? 0 : 15000;
    document.getElementById('subtotal').textContent = formatPrice(sub);
    document.getElementById('shipFee').textContent = formatPrice(ship);
    document.getElementById('grandTotal').textContent = formatPrice(sub + ship);
  }

  document.getElementById('delivType')?.addEventListener('change', renderSummary);

  function setFieldError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.borderColor = msg ? 'var(--red)' : '';
    let hint = el.parentElement.querySelector('.field-hint');
    if (msg) {
      if (!hint) { hint = document.createElement('div'); hint.className = 'field-hint'; hint.style.cssText = 'color:var(--red);font-size:0.78rem;margin-top:4px'; el.parentElement.appendChild(hint); }
      hint.textContent = msg;
    } else {
      if (hint) hint.remove();
    }
  }

  function clearErrors() {
    ['custName','custPhone','custAddr'].forEach(id => setFieldError(id, ''));
  }

  function submitOrder() {
    clearErrors();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const addr = document.getElementById('custAddr').value.trim();
    const delivType = document.getElementById('delivType').value;

    let hasError = false;
    if (!name) { setFieldError('custName', '⚠️ Vui lòng nhập họ và tên'); hasError = true; }
    if (!phone) {
      setFieldError('custPhone', '⚠️ Vui lòng nhập số điện thoại'); hasError = true;
    } else if (!/^(0|\+84)[0-9]{9}$/.test(phone.replace(/\s/g, ''))) {
      setFieldError('custPhone', '⚠️ Số điện thoại không hợp lệ (VD: 0912345678)'); hasError = true;
    }
    if (delivType === 'delivery' && !addr) { setFieldError('custAddr', '⚠️ Vui lòng nhập địa chỉ giao hàng'); hasError = true; }
    if (hasError) return;

    const cart = getCart();
    const prods = getProducts();
    const ship = delivType === 'pickup' ? 0 : 15000;

    const order = {
      id: 'CP' + Date.now(),
      date: new Date().toLocaleString('vi-VN'),
      customer: { name, phone, addr, delivType, note: document.getElementById('custNote').value, pay: document.getElementById('payMethod').value },
      items: cart.map(item => {
        const p = prods.find(pr => pr.id === item.id);
        const fp = p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;
        return { id: item.id, name: p.name, icon: p.icon, qty: item.qty, price: fp };
      }),
      subtotal: getCartTotal(),
      ship,
      total: getCartTotal() + ship,
      status: 'pending'
    };

    const orders = getOrders();
    orders.unshift(order);
    saveOrders(orders);
    saveCart([]);
    updateCartBadge();

    document.getElementById('orderForm').style.display = 'none';
    document.getElementById('successBox').style.display = 'block';
  }

  renderSummary();
  updateCartBadge();
