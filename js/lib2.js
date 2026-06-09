  const CAT_NAMES = { trasua:'Trà Sữa', tradacbiet:'Trà Đặc Biệt', caphe:'Cà Phê', tuoi:'Nước Tươi', dam:'Đặc Biệt Đậm' };
  const STATUS_MAP = { pending:{l:'Đang Chờ',c:'status-pending'}, confirmed:{l:'Đã Xác Nhận',c:'status-confirmed'}, done:{l:'Hoàn Thành',c:'status-done'}, cancelled:{l:'Đã Hủy',c:'status-cancelled'} };

  // ===== LOGIN =====
  // Thông tin tài khoản admin lưu trong JS (không hiện trong HTML)
  const ADMIN_ACCOUNTS = [
    { username: 'admin', password: '1234', name: 'Admin' }
  ];

  function doLogin() {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value.trim();
    const found = ADMIN_ACCOUNTS.find(a => a.username === u && a.password === p);
    if (found) {
      document.getElementById('loginError').style.display = 'none';
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('adminLayout').style.display = 'flex';
      renderDashboard();
    } else {
      document.getElementById('loginError').style.display = 'block';
      document.getElementById('loginPass').value = '';
      document.getElementById('loginPass').focus();
    }
  }

  function doLogout() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminLayout').style.display = 'none';
  }

  // ===== NAVIGATION =====
  function switchPanel(name) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    document.getElementById('panel-' + name).classList.add('active');
    document.getElementById('nav-' + name)?.classList.add('active');
    const titles = { dashboard:'📊 Tổng Quan', products:'🧋 Sản Phẩm', orders:'📋 Đơn Hàng', promo:'🔥 Khuyến Mãi' };
    document.getElementById('topbarTitle').textContent = titles[name] || '';
    if (name === 'dashboard') renderDashboard();
    else if (name === 'products') renderProductsTable();
    else if (name === 'orders') renderOrdersTable();
    else if (name === 'promo') renderPromoTable();
  }

  // ===== DASHBOARD =====
  function renderDashboard() {
    const products = getProducts();
    const orders = getOrders();
    const revenue = orders.filter(o => o.status === 'done').reduce((s, o) => s + o.total, 0);
    const pendingCount = orders.filter(o => o.status === 'pending').length;

    document.getElementById('statsGrid').innerHTML = `
      <div class="stat-card"><div class="stat-icon">🧋</div><div><div class="stat-label">Tổng Sản Phẩm</div><div class="stat-value">${products.length}</div></div></div>
      <div class="stat-card"><div class="stat-icon">📋</div><div><div class="stat-label">Tổng Đơn Hàng</div><div class="stat-value">${orders.length}</div></div></div>
      <div class="stat-card"><div class="stat-icon">⏳</div><div><div class="stat-label">Đơn Chờ Xử Lý</div><div class="stat-value">${pendingCount}</div></div></div>
      <div class="stat-card"><div class="stat-icon">💰</div><div><div class="stat-label">Doanh Thu (xong)</div><div class="stat-value">${formatPrice(revenue)}</div></div></div>
    `;

    const tbody = document.getElementById('recentOrdersBody');
    const recent = orders.slice(0, 8);
    if (recent.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">Chưa có đơn hàng nào</td></tr>';
    } else {
      tbody.innerHTML = recent.map(o => {
        const s = STATUS_MAP[o.status] || STATUS_MAP.pending;
        return `<tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.customer.name}</td>
          <td>${formatPrice(o.total)}</td>
          <td><span class="status-badge ${s.c}">${s.l}</span></td>
          <td>${o.date}</td>
        </tr>`;
      }).join('');
    }
  }

  // ===== PRODUCTS =====
  function renderProductsTable() {
    const q = document.getElementById('productSearch').value.toLowerCase();
    const cat = document.getElementById('catFilter').value;
    let prods = getProducts();
    if (cat) prods = prods.filter(p => p.category === cat);
    if (q) prods = prods.filter(p => p.name.toLowerCase().includes(q));

    const tbody = document.getElementById('productsTableBody');
    if (prods.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">Không tìm thấy sản phẩm</td></tr>';
      return;
    }
    tbody.innerHTML = prods.map(p => {
      const fp = p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;
      return `<tr>
        <td style="font-size:1.4rem">${p.img ? `<img src="../assets/${p.img}" style="width:46px;height:46px;object-fit:cover;border-radius:8px;vertical-align:middle;" onerror="this.outerHTML='${p.icon}'">` : p.icon}</td>
        <td><strong>${p.name}</strong>${p.isNew ? ' <span style="font-size:0.7rem;background:var(--accent);padding:1px 6px;border-radius:8px;">MỚI</span>' : ''}</td>
        <td>${CAT_NAMES[p.category] || p.category}</td>
        <td>${formatPrice(p.price)}</td>
        <td>${p.sale > 0 ? `<span class="badge-sale-sm">-${p.sale}%</span>` : '<span style="color:#aaa">—</span>'}</td>
        <td style="font-weight:700;color:var(--primary)">${formatPrice(fp)}</td>
        <td><span class="${p.available ? 'badge-available' : 'badge-unavailable'}">${p.available ? 'Còn hàng' : 'Hết hàng'}</span></td>
        <td>
          <div class="action-btns">
            <button class="btn-sm btn-sm-edit" onclick="openEditProduct(${p.id})">✏️ Sửa</button>
            <button class="btn-sm btn-sm-toggle" onclick="toggleAvailable(${p.id})">${p.available ? '🔴 Hết' : '🟢 Còn'}</button>
            <button class="btn-sm btn-sm-del" onclick="deleteProduct(${p.id})">🗑️</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  function openAddProduct() {
    document.getElementById('modalTitle').textContent = '➕ Thêm Sản Phẩm';
    document.getElementById('editId').value = '';
    document.getElementById('editName').value = '';
    document.getElementById('editDesc').value = '';
    document.getElementById('editIcon').value = '🧋';
    document.getElementById('editCat').value = 'trasua';
    document.getElementById('editPrice').value = '';
    document.getElementById('editSale').value = '0';
    document.getElementById('editAvailable').value = 'true';
    document.getElementById('editNew').value = 'false';
    document.getElementById('productModal').classList.add('open');
  }

  function openEditProduct(id) {
    const p = getProducts().find(pr => pr.id === id);
    if (!p) return;
    document.getElementById('modalTitle').textContent = '✏️ Sửa Sản Phẩm';
    document.getElementById('editId').value = p.id;
    document.getElementById('editName').value = p.name;
    document.getElementById('editDesc').value = p.desc;
    document.getElementById('editIcon').value = p.icon;
    document.getElementById('editCat').value = p.category;
    document.getElementById('editPrice').value = p.price;
    document.getElementById('editSale').value = p.sale;
    document.getElementById('editAvailable').value = String(p.available);
    document.getElementById('editNew').value = String(p.isNew);
    document.getElementById('productModal').classList.add('open');
  }

  function closeModal() {
    document.getElementById('productModal').classList.remove('open');
  }

  function saveProduct() {
    const name = document.getElementById('editName').value.trim();
    const price = parseInt(document.getElementById('editPrice').value);
    if (!name || isNaN(price) || price <= 0) { showToast('⚠️ Vui lòng điền đủ thông tin!'); return; }

    const prods = getProducts();
    const id = document.getElementById('editId').value;
    const data = {
      name, price,
      desc: document.getElementById('editDesc').value.trim(),
      icon: document.getElementById('editIcon').value || '🧋',
      category: document.getElementById('editCat').value,
      sale: parseInt(document.getElementById('editSale').value) || 0,
      available: document.getElementById('editAvailable').value === 'true',
      isNew: document.getElementById('editNew').value === 'true',
    };

    if (id) {
      const idx = prods.findIndex(p => p.id === parseInt(id));
      if (idx !== -1) prods[idx] = { ...prods[idx], ...data };
    } else {
      data.id = Date.now();
      prods.push(data);
    }
    saveProducts(prods);
    closeModal();
    renderProductsTable();
    showToast('✅ Đã lưu sản phẩm!');
  }

  function toggleAvailable(id) {
    const prods = getProducts();
    const p = prods.find(pr => pr.id === id);
    if (!p) return;
    p.available = !p.available;
    saveProducts(prods);
    renderProductsTable();
    showToast(p.available ? '✅ Đã bật còn hàng' : '🔴 Đã đánh dấu hết hàng');
  }

  function deleteProduct(id) {
    if (!confirm('Xác nhận xóa sản phẩm này?')) return;
    const prods = getProducts().filter(p => p.id !== id);
    saveProducts(prods);
    renderProductsTable();
    showToast('🗑️ Đã xóa sản phẩm');
  }

  // ===== ORDERS =====
  function renderOrdersTable() {
    const filter = document.getElementById('orderStatusFilter').value;
    let orders = getOrders();
    if (filter) orders = orders.filter(o => o.status === filter);

    const tbody = document.getElementById('ordersTableBody');
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-msg">Không có đơn hàng nào</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(o => {
      const s = STATUS_MAP[o.status] || STATUS_MAP.pending;
      const itemsStr = o.items.map(i => `${i.icon}${i.name} x${i.qty}`).join(', ');
      return `<tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customer.name}</td>
        <td>${o.customer.phone}</td>
        <td style="max-width:200px;font-size:0.8rem;color:var(--text-muted)">${itemsStr}</td>
        <td style="font-weight:700;color:var(--primary)">${formatPrice(o.total)}</td>
        <td><span class="status-badge ${s.c}">${s.l}</span></td>
        <td style="font-size:0.8rem">${o.date}</td>
        <td>
          <select class="sel-status" onchange="updateOrderStatus('${o.id}', this.value)">
            <option value="pending" ${o.status==='pending'?'selected':''}>Đang Chờ</option>
            <option value="confirmed" ${o.status==='confirmed'?'selected':''}>Xác Nhận</option>
            <option value="done" ${o.status==='done'?'selected':''}>Hoàn Thành</option>
            <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Hủy</option>
          </select>
        </td>
      </tr>`;
    }).join('');
  }

  function updateOrderStatus(id, status) {
    const orders = getOrders();
    const o = orders.find(or => or.id === id);
    if (!o) return;
    o.status = status;
    saveOrders(orders);
    showToast('✅ Đã cập nhật trạng thái đơn hàng');
    renderOrdersTable();
  }

  // ===== PROMO =====
  function renderPromoTable() {
    const prods = getProducts().filter(p => p.sale > 0);
    const tbody = document.getElementById('promoTableBody');
    if (prods.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-msg">Hiện không có sản phẩm nào đang giảm giá</td></tr>';
      return;
    }
    tbody.innerHTML = prods.map(p => {
      const fp = Math.round(p.price * (1 - p.sale / 100));
      return `<tr>
        <td style="font-size:1.3rem">${p.img ? `<img src="../assets/${p.img}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;vertical-align:middle;" onerror="this.outerHTML='${p.icon}'">` : p.icon}</td>
        <td><strong>${p.name}</strong></td>
        <td>${formatPrice(p.price)}</td>
        <td><span class="badge-sale-sm">-${p.sale}%</span></td>
        <td style="font-weight:700;color:var(--primary)">${formatPrice(fp)}</td>
        <td>
          <div class="action-btns">
            <input type="number" min="0" max="100" value="${p.sale}" style="width:60px;padding:4px 8px;border:1px solid #ddd;border-radius:6px;font-size:0.82rem" id="sale-${p.id}">
            <button class="btn-sm btn-sm-edit" onclick="setSaleOne(${p.id})">Lưu</button>
            <button class="btn-sm btn-sm-del" onclick="clearSaleOne(${p.id})">Xóa</button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  function applyPromo() {
    const cat = document.getElementById('promoCat').value;
    const pct = parseInt(document.getElementById('promoPercent').value);
    if (isNaN(pct) || pct < 0 || pct > 100) { showToast('⚠️ % giảm giá không hợp lệ!'); return; }
    const prods = getProducts();
    prods.forEach(p => {
      if (!cat || p.category === cat) p.sale = pct;
    });
    saveProducts(prods);
    renderPromoTable();
    showToast(`✅ Đã áp dụng giảm ${pct}% ${cat ? 'cho ' + CAT_NAMES[cat] : 'cho tất cả'}!`);
  }

  function clearPromo() {
    const cat = document.getElementById('promoCat').value;
    const prods = getProducts();
    prods.forEach(p => { if (!cat || p.category === cat) p.sale = 0; });
    saveProducts(prods);
    renderPromoTable();
    showToast('✅ Đã xóa khuyến mãi!');
  }

  function setSaleOne(id) {
    const val = parseInt(document.getElementById('sale-' + id).value);
    if (isNaN(val) || val < 0 || val > 100) { showToast('⚠️ Giá trị không hợp lệ!'); return; }
    const prods = getProducts();
    const p = prods.find(pr => pr.id === id);
    if (p) p.sale = val;
    saveProducts(prods);
    renderPromoTable();
    showToast('✅ Đã cập nhật giảm giá!');
  }

  function clearSaleOne(id) {
    const prods = getProducts();
    const p = prods.find(pr => pr.id === id);
    if (p) p.sale = 0;
    saveProducts(prods);
    renderPromoTable();
    showToast('✅ Đã xóa khuyến mãi cho sản phẩm!');
  }

  // Close modal on overlay click
  document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
