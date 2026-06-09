const STATUS_MAP = {
    pending: { label: 'Đang Chờ', cls: 'status-pending' },
    confirmed: { label: 'Đã Xác Nhận', cls: 'status-confirmed' },
    done: { label: 'Hoàn Thành', cls: 'status-done' },
    cancelled: { label: 'Đã Hủy', cls: 'status-cancelled' },
  };

  function renderOrders() {
    const orders = getOrders();
    const container = document.getElementById('ordersContainer');
    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-orders">
          <div class="big">📋</div>
          <p style="font-size:1.1rem;font-weight:600;margin-bottom:8px">Chưa có đơn hàng nào</p>
          <a href="menu.html" class="btn btn-primary" style="margin-top:16px">Đặt Hàng Ngay</a>
        </div>`;
      return;
    }
    container.innerHTML = orders.map(o => {
      const s = STATUS_MAP[o.status] || STATUS_MAP.pending;
      const delivLabel = o.customer.delivType === 'pickup' ? '🏪 Tự đến lấy' : '🛵 Giao hàng';
      return `
        <div class="order-card">
          <div class="order-card-header">
            <div>
              <div class="order-id">Đơn #${o.id}</div>
              <div class="order-date">📅 ${o.date} · ${delivLabel}</div>
            </div>
            <span class="status-badge ${s.cls}">${s.label}</span>
          </div>
          <div><strong>👤</strong> ${o.customer.name} – ${o.customer.phone}</div>
          ${o.customer.addr ? `<div style="font-size:0.88rem;color:var(--text-muted)">📍 ${o.customer.addr}</div>` : ''}
          ${o.customer.note ? `<div style="font-size:0.85rem;color:var(--text-muted)">📝 ${o.customer.note}</div>` : ''}
          <div class="order-items-list">
            ${o.items.map(i => `
              <div class="mini-item">
                <span>${i.icon} ${i.name} x${i.qty}</span>
                <span>${formatPrice(i.price * i.qty)}</span>
              </div>`).join('')}
          </div>
          <div class="order-total-row">
            <span>Tổng cộng (gồm ship)</span>
            <span>${formatPrice(o.total)}</span>
          </div>
        </div>`;
    }).join('');
  }

  renderOrders();
  updateCartBadge();