document.addEventListener('DOMContentLoaded', function() {

const CATS_VN = {
  trasua: 'Trà Sữa',
  tradacbiet: 'Trà Đặc Biệt',
  caphe: 'Cà Phê Sáng Tạo',
  tuoi: 'Nước Tươi / COCO',
  dam: 'Đặc Biệt Đậm'
};
const CAT_NOTES = {
  trasua: 'Được pha từ trà đen thượng hạng kết hợp sữa tươi nhập khẩu. Thêm topping theo sở thích.',
  tradacbiet: 'Trà nguyên lá chọn lọc, ướp lạnh và pha thủ công. Hương vị tự nhiên, không đường nhân tạo.',
  caphe: 'Cà phê rang xay tại chỗ, pha phin truyền thống. Kết hợp topping sáng tạo độc quyền.',
  tuoi: 'Nguyên liệu tươi nhập về hàng ngày. Không chất bảo quản. Uống ngay trong ngày.',
  dam: 'Dòng đặc biệt sử dụng khoai môn, sen, đào tươi nguyên chất. Đậm vị, giàu dinh dưỡng.'
};

let qty = 1;
let selectedSize = 'M';
let selectedSugar = '100%';

// Get product ID from URL ?id=N
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get('id') || '1');
const products = getProducts();
const p = products.find(pr => pr.id === productId) || products[0];

if (!p) {
  document.getElementById('detail-wrap').innerHTML = '<p style="text-align:center;padding:60px;color:#aaa">Không tìm thấy sản phẩm.</p>';
  return;
}

// Breadcrumb
const bcEl = document.getElementById('breadcrumb-name');
if (bcEl) bcEl.textContent = p.name;

// Compute price
const basePrice = p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;
const SIZE_EXTRA = { S: -3000, M: 0, L: 5000 };

function getTotal() {
  return (basePrice + SIZE_EXTRA[selectedSize]) * qty;
}

function renderDetail() {
  const wrap = document.getElementById('detail-wrap');
  if (!wrap) return;
  const badgeHtml = p.sale > 0
    ? `<div class="product-big-badge">🔥 SALE -${p.sale}%</div>`
    : p.isNew ? `<div class="product-big-badge new-badge">✨ MỚI</div>` : '';
  const outBadge = !p.available ? `<div class="product-big-badge out-badge">Hết Hàng</div>` : '';

  wrap.innerHTML = `
    <div>
      <div class="product-big-img">
        ${badgeHtml}${outBadge}
        ${p.img
          ? `<img src="../assets/${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:calc(var(--radius)*1.5);" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="font-size:8rem;display:none;align-items:center;justify-content:center;width:100%;height:100%">${p.icon}</span>`
          : `<span style="font-size:8rem">${p.icon}</span>`}
      </div>
    </div>
    <div class="product-detail-info">
      <div class="detail-category">${CATS_VN[p.category] || p.category}</div>
      <div class="detail-name">${p.name}</div>
      <div class="detail-desc">${p.desc}. ${CAT_NOTES[p.category] || ''}</div>

      <div class="detail-price-row">
        <span class="detail-price" id="detail-price-display">${formatPrice(getTotal())}</span>
        ${p.sale > 0 ? `<span class="detail-price-old">${formatPrice(p.price)}</span><span class="detail-sale-tag">-${p.sale}%</span>` : ''}
      </div>

      <div class="size-select-label">🥤 Chọn Size:</div>
      <div class="size-btns">
        <button class="size-btn ${selectedSize==='S'?'selected':''}" onclick="selectSize('S',this)">S (nhỏ) -3.000đ</button>
        <button class="size-btn ${selectedSize==='M'?'selected':''}" onclick="selectSize('M',this)">M (vừa)</button>
        <button class="size-btn ${selectedSize==='L'?'selected':''}" onclick="selectSize('L',this)">L (lớn) +5.000đ</button>
      </div>

      <div class="sugar-label">🍬 Độ Ngọt:</div>
      <div class="sugar-btns">
        ${['0%','30%','50%','70%','100%'].map(s =>
          `<button class="sugar-btn ${selectedSugar===s?'selected':''}" onclick="selectSugar('${s}',this)">${s}</button>`
        ).join('')}
      </div>

      <div class="qty-row">
        <label>Số Lượng:</label>
        <div class="qty-control">
          <button onclick="changeQtyLocal(-1)">−</button>
          <span id="qty-display">${qty}</span>
          <button onclick="changeQtyLocal(1)">+</button>
        </div>
      </div>

      ${!p.available ? `<div class="out-notice">⚠️ Sản phẩm này hiện đang hết hàng. Vui lòng quay lại sau!</div>` : ''}

      <button class="btn-add-detail" ${!p.available?'disabled':''} onclick="handleAddDetail()">
        🛒 Thêm vào Giỏ – <span id="btn-price">${formatPrice(getTotal())}</span>
      </button>
      <a href="order.html" class="btn-order-detail">⚡ Đặt Ngay</a>

      <div style="margin-top:24px">
        <div class="product-info-table">
          <h4>ℹ️ Thông Tin Sản Phẩm</h4>
          <div class="info-row"><span class="lbl">Danh Mục</span><span class="val">${CATS_VN[p.category]}</span></div>
          <div class="info-row"><span class="lbl">Giá Gốc</span><span class="val">${formatPrice(p.price)}</span></div>
          <div class="info-row"><span class="lbl">Giảm Giá</span><span class="val">${p.sale > 0 ? p.sale + '%' : 'Không'}</span></div>
          <div class="info-row"><span class="lbl">Tình Trạng</span><span class="val" style="color:${p.available?'var(--primary)':'#c0392b'}">${p.available ? '✅ Còn Hàng' : '❌ Hết Hàng'}</span></div>
          <div class="info-row"><span class="lbl">Thời Gian Pha</span><span class="val">3 – 5 phút</span></div>
        </div>
      </div>
    </div>
  `;
}

function updatePriceDisplay() {
  const t = getTotal();
  const el = document.getElementById('detail-price-display');
  const bp = document.getElementById('btn-price');
  if (el) el.textContent = formatPrice(t);
  if (bp) bp.textContent = formatPrice(t);
}

window.selectSize = function(size, btn) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updatePriceDisplay();
};

window.selectSugar = function(sugar, btn) {
  selectedSugar = sugar;
  document.querySelectorAll('.sugar-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
};

window.changeQtyLocal = function(delta) {
  qty = Math.max(1, qty + delta);
  const el = document.getElementById('qty-display');
  if (el) el.textContent = qty;
  updatePriceDisplay();
};

window.handleAddDetail = function() {
  for (let i = 0; i < qty; i++) addToCart(p.id);
  showToast(`✅ Đã thêm ${qty} ly vào giỏ hàng!`);
  renderCartSidebar();
};

// Render related products (same category, exclude self)
function renderRelated() {
  const related = products.filter(pr => pr.category === p.category && pr.id !== p.id).slice(0, 4);
  const relSection = document.getElementById('related-section');
  const relGrid = document.getElementById('related-grid');
  if (!relSection || !relGrid || related.length === 0) return;
  relSection.style.display = 'block';
  relGrid.innerHTML = related.map(pr => {
    const fp = pr.sale > 0 ? Math.round(pr.price * (1 - pr.sale / 100)) : pr.price;
    const badge = pr.sale > 0 ? `<span class="badge-sale">-${pr.sale}%</span>` : pr.isNew ? `<span class="badge-new">MỚI</span>` : '';
    const outBadge = !pr.available ? `<span class="badge-out">Hết</span>` : '';
    return `
      <div class="product-card" style="cursor:pointer" onclick="window.location='product.html?id=${pr.id}'">
        ${badge}${outBadge}
        <div class="product-img">
          ${pr.img
            ? `<img src="../assets/${pr.img}" alt="${pr.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="font-size:3rem;display:none;align-items:center;justify-content:center;width:100%;height:100%">${pr.icon}</span>`
            : `<span class="img-fallback">${pr.icon}</span>`}
        </div>
        <div class="product-info">
          <div class="product-name">${pr.name}</div>
          <div class="product-desc">${pr.desc}</div>
          <div class="product-price">
            <div>
              <span class="price">${formatPrice(fp)}</span>
              ${pr.sale > 0 ? `<span class="price-old">${formatPrice(pr.price)}</span>` : ''}
            </div>
            <button class="btn-add" onclick="event.stopPropagation();handleRelatedAdd(${pr.id})" ${!pr.available?'disabled':''}>
              ${pr.available ? '+ Thêm' : 'Hết'}
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

window.handleRelatedAdd = function(id) {
  addToCart(id);
  showToast('✅ Đã thêm vào giỏ hàng!');
  renderCartSidebar();
};

function renderCartSidebar() {
  const cart = getCart();
  const prods = getProducts();
  const container = document.getElementById('cartItems');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#aaa;padding:40px 0">Giỏ hàng trống 😢</p>';
  } else {
    container.innerHTML = cart.map(item => {
      const pr = prods.find(x => x.id === item.id);
      if (!pr) return '';
      const fp2 = pr.sale > 0 ? Math.round(pr.price * (1 - pr.sale / 100)) : pr.price;
      return `
        <div class="cart-item">
          <div class="cart-item-icon">${pr.img ? `<img src="../assets/${pr.img}" style="width:44px;height:44px;object-fit:cover;border-radius:10px;" onerror="this.style.display='none'">` : pr.icon}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${pr.name}</div>
            <div class="cart-item-price">${formatPrice(fp2)}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeCartQty(${pr.id},-1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeCartQty(${pr.id},1)">+</button>
          </div>
        </div>`;
    }).join('');
  }
  const totalEl = document.getElementById('cartTotalEl');
  if (totalEl) totalEl.textContent = formatPrice(getCartTotal());
}

window.changeCartQty = function(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart.splice(cart.indexOf(item), 1);
  saveCart(cart);
  updateCartBadge();
  renderCartSidebar();
};

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}
window.closeCart = closeCart;

const navCart = document.querySelector('.nav-cart');
if (navCart) {
  navCart.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    renderCartSidebar();
  });
}

// Init
renderDetail();
renderRelated();
updateCartBadge();

}); // end DOMContentLoaded
