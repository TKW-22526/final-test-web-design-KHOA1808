// ===== SHARED DATA =====
const PRODUCTS_KEY = 'biburn_products';
const CART_KEY = 'biburn_cart';
const ORDERS_KEY = 'biburn_orders';

const DEFAULT_PRODUCTS = [
  // TRÀ SỮA
  { id: 1,  name: 'Trà Sữa Trân Châu',           category: 'trasua',     price: 29000, icon: '🧋', img: 'tra-sua-tran-chau.jpg',           desc: 'Trà sữa đậm đà với trân châu dai ngon',                available: true, sale: 0,  isNew: false },
  { id: 2,  name: 'Trà Sữa Kem Cheese',           category: 'trasua',     price: 35000, icon: '🧋', img: 'tra-sua-kem-cheese.jpg',           desc: 'Lớp kem cheese mặn ngọt trên nền trà thơm',            available: true, sale: 0,  isNew: true  },
  { id: 3,  name: 'Trà Sữa Matcha',               category: 'trasua',     price: 32000, icon: '🍵', img: 'tra-sua-matcha.jpg',               desc: 'Matcha Nhật Bản hòa quyện cùng sữa tươi',              available: true, sale: 10, isNew: false },
  { id: 4,  name: 'Trà Sữa Pudding Trứng',        category: 'trasua',     price: 33000, icon: '🧋', img: 'tra-sua-pudding-trung.jpg',        desc: 'Pudding trứng mềm mịn, ngọt nhẹ',                      available: true, sale: 0,  isNew: false },
  { id: 5,  name: 'Trà Sữa Thạch Nhãn',           category: 'trasua',     price: 31000, icon: '🧋', img: 'tra-sua-thach-nhan.jpg',           desc: 'Thạch nhãn giòn tan kết hợp trà sữa',                  available: true, sale: 0,  isNew: false },
  { id: 6,  name: 'Trà Sữa Nocola',               category: 'trasua',     price: 30000, icon: '🧋', img: 'tra-sua-nocola.jpg',               desc: 'Nocola đặc biệt – vị độc đáo của BiBurn',             available: true, sale: 0,  isNew: false },

  // TRÀ ĐẶC BIỆT
  { id: 7,  name: 'Ôlong Sơn Vàng',               category: 'tradacbiet', price: 29000, icon: '🍃', img: 'olong-son-vang.jpg',               desc: 'Ôlong truyền thống hương thơm thanh tao',               available: true, sale: 0,  isNew: false },
  { id: 8,  name: 'Trà Đào Nổi Thơm Ổi',          category: 'tradacbiet', price: 28000, icon: '🍑', img: 'tra-dao-noi-thom-oi.jpg',          desc: 'Trà đào kết hợp hương ổi tươi mát',                    available: true, sale: 0,  isNew: false },
  { id: 9,  name: 'Trà Anh Đào Hibiscus',          category: 'tradacbiet', price: 30000, icon: '🌸', img: 'tra-dao-hibiscus.jpg',             desc: 'Màu hồng đẹp, vị chua nhẹ từ hibiscus',                available: true, sale: 15, isNew: true  },
  { id: 10, name: 'Trà Vải',                       category: 'tradacbiet', price: 27000, icon: '🍈', img: 'tra-vai.jpg',                      desc: 'Trà vải thanh mát, ngọt tự nhiên',                     available: true, sale: 0,  isNew: false },
  { id: 11, name: 'Trà Mật Ong Kim Quất',          category: 'tradacbiet', price: 30000, icon: '🍋', img: 'tra-mat-ong-kim-quat.jpg',         desc: 'Mật ong + kim quất – tốt cho sức khỏe',                available: true, sale: 0,  isNew: false },

  // CÀ PHÊ SÁNG TẠO
  { id: 12, name: 'Cà Phê Muối',                  category: 'caphe',      price: 29000, icon: '☕', img: 'ca-phe-muoi.jpg',                  desc: 'Cà phê với lớp kem muối béo ngậy',                     available: true, sale: 0,  isNew: false },
  { id: 13, name: 'Cà Phê Phô Mai',               category: 'caphe',      price: 32000, icon: '☕', img: 'ca-phe-pho-mai.jpg',               desc: 'Phô mai kem tan chảy trên cà phê đậm',                 available: true, sale: 0,  isNew: true  },
  { id: 14, name: 'Cà Phê Sữa Tươi',              category: 'caphe',      price: 27000, icon: '☕', img: 'ca-phe-sua-tuoi.jpg',              desc: 'Cà phê mộc pha sữa tươi nhập khẩu',                   available: true, sale: 0,  isNew: false },
  { id: 15, name: 'Bơ Sữa Non',                   category: 'caphe',      price: 35000, icon: '☕', img: 'bo-sua-non.jpg',                   desc: 'Cà phê bơ sữa non béo ngậy, thơm nức',                available: true, sale: 20, isNew: false },

  // NƯỚC TƯƠI / COCO
  { id: 16, name: 'Sữa Tươi Dâu Rừng',            category: 'tuoi',       price: 27000, icon: '🍓', img: 'sua-tuoi-dau-rung.jpg',            desc: 'Dâu rừng tươi xay cùng sữa mát lạnh',                 available: true, sale: 0,  isNew: false },
  { id: 17, name: 'Sữa Chuối Dừa Nướng',          category: 'tuoi',       price: 28000, icon: '🍌', img: 'sua-chuoi-dua-nuong.jpg',          desc: 'Chuối + dừa nướng thơm lừng',                         available: true, sale: 0,  isNew: false },
  { id: 18, name: 'COCO Phê',                      category: 'tuoi',       price: 30000, icon: '🥥', img: 'coco-phe.jpg',                     desc: 'Nước dừa tươi + cà phê – năng lượng mới',             available: true, sale: 0,  isNew: true  },
  { id: 19, name: 'COCO Mint',                     category: 'tuoi',       price: 28000, icon: '🥥', img: 'coco-mint.jpg',                    desc: 'Nước dừa bạc hà mát lạnh ngày hè',                    available: true, sale: 0,  isNew: false },
  { id: 20, name: 'Sữa Tươi Trân Châu Đường Đen', category: 'tuoi',       price: 32000, icon: '🍼', img: 'sua-tuoi-tran-chau-duong-den.jpg', desc: 'Trân châu đường đen béo ngọt cùng sữa tươi',          available: true, sale: 0,  isNew: false },

  // KHOAI MÔN / ĐẬM
  { id: 21, name: 'Ôlong Khoai Môn Nghiền',       category: 'dam',        price: 33000, icon: '🫧', img: 'olong-khoai-mon-nghien.jpg',       desc: 'Khoai môn nghiền mịn với trà ôlong thơm',              available: true, sale: 0,  isNew: false },
  { id: 22, name: 'Ôlong Sữa Khoai Môn',          category: 'dam',        price: 35000, icon: '🫧', img: 'olong-sua-khoai-mon.jpg',          desc: 'Béo ngậy, ngọt tự nhiên từ khoai môn',                 available: true, sale: 10, isNew: true  },
  { id: 23, name: 'Trà Sen Sữa',                  category: 'dam',        price: 33000, icon: '🪷', img: 'tra-sen-sua.jpg',                  desc: 'Hương sen thanh khiết hòa cùng sữa tươi',              available: true, sale: 0,  isNew: false },
  { id: 24, name: 'Trà Đào Sữa',                  category: 'dam',        price: 31000, icon: '🍑', img: 'tra-dao-sua.jpg',                  desc: 'Đào chín + sữa = combo hoàn hảo',                      available: true, sale: 0,  isNew: false },
];

// Resolve image path relative to a base (root or html/)
function imgSrc(p, base) {
  if (!p.img) return null;
  return (base || '../assets/') + p.img;
}

function getProducts() {
  const saved = localStorage.getItem(PRODUCTS_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    // Merge img field from DEFAULT in case it's missing (admin saved old format)
    return parsed.map(p => {
      const def = DEFAULT_PRODUCTS.find(d => d.id === p.id);
      return def ? { ...p, img: p.img || def.img, icon: p.icon || def.icon } : p;
    });
  }
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function getCart() {
  const saved = localStorage.getItem(CART_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getOrders() {
  const saved = localStorage.getItem(ORDERS_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function addToCart(productId) {
  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product || !product.available) return false;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  saveCart(cart);
  updateCartBadge();
  return true;
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.querySelector('.cart-count');
  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
  }
}

function getCartTotal() {
  const cart = getCart();
  const products = getProducts();
  return cart.reduce((sum, item) => {
    const p = products.find(pr => pr.id === item.id);
    if (!p) return sum;
    const finalPrice = p.sale > 0 ? Math.round(p.price * (1 - p.sale / 100)) : p.price;
    return sum + finalPrice * item.qty;
  }, 0);
}

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + 'đ';
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

