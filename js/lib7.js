const FAQS = [
  { q: 'BiBurn có giao hàng tận nơi không?', a: 'Có! BiBurn giao hàng trong bán kính 5km từ cửa hàng. Phí ship 15.000đ, miễn phí với đơn từ 100.000đ. Thời gian giao 15-30 phút.' },
  { q: 'Tôi có thể đặt hàng qua điện thoại không?', a: 'Ngoài website, bạn có thể gọi trực tiếp đến hotline 0777 777 777 để đặt hàng. Nhân viên sẽ hỗ trợ bạn.' },
  { q: 'Sản phẩm có sử dụng nguyên liệu tươi không?', a: 'Tất cả nguyên liệu tại BiBurn được nhập mới mỗi ngày, không dùng chất bảo quản hay phụ gia tổng hợp. Trân châu được nấu tươi mỗi buổi sáng.' },
  { q: 'Tôi có thể yêu cầu ít đường hoặc không đường không?', a: 'Hoàn toàn được! Khi đặt hàng trên trang chi tiết sản phẩm, bạn có thể chọn độ ngọt từ 0% đến 100%. Hoặc ghi chú trong phần ghi chú đơn hàng.' },
  { q: 'Có chương trình khuyến mãi nào đang diễn ra không?', a: 'Hiện tại có mã BiBurn10 giảm 10% cho đơn từ 50.000đ, có hiệu lực đến 30/6/2026. Ngoài ra một số sản phẩm đang giảm giá 10-20%, xem tại tab "Đang Giảm Giá" trong thực đơn.' },
  { q: 'Tôi quên mã đơn hàng, làm sao tra cứu?', a: 'Bạn có thể xem lại tất cả đơn hàng đã đặt tại trang "Đơn Hàng Của Tôi". Lịch sử đơn được lưu trên trình duyệt của bạn.' },
  { q: 'Nếu đơn hàng bị sai, tôi phải làm gì?', a: 'Liên hệ ngay hotline 0777 777 777 trong vòng 1 giờ sau khi nhận hàng. BiBurn sẽ làm lại miễn phí nếu lỗi đến từ phía cửa hàng.' },
  { q: 'Website có bảo mật thông tin cá nhân không?', a: 'Thông tin cá nhân của bạn (tên, số điện thoại, địa chỉ) chỉ được dùng để xử lý đơn hàng và không được chia sẻ với bên thứ ba. Dữ liệu lưu trên thiết bị của bạn.' },
];

function buildFAQ() {
  const list = document.getElementById('faq-list');
  list.innerHTML = FAQS.map((item, i) => `
    <div class="faq-item">
      <div class="faq-question" onclick="toggleFAQ(${i}, this)">
        <span>❓ ${item.q}</span>
        <span class="faq-arrow">▼</span>
      </div>
      <div class="faq-answer" id="faq-ans-${i}">${item.a}</div>
    </div>
  `).join('');
}

function toggleFAQ(i, btn) {
  const ans = document.getElementById('faq-ans-' + i);
  const isOpen = ans.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-question').forEach(b => b.classList.remove('open'));
  if (!isOpen) {
    ans.classList.add('open');
    btn.classList.add('open');
  }
}

function showTab(name, btn) {
  document.querySelectorAll('.policy-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.policy-tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  btn.classList.add('active');
}

buildFAQ();
updateCartBadge();

document.querySelector('.nav-cart').addEventListener('click', function(e) {
  e.preventDefault();
  // redirect to order page
  window.location.href = 'order.html';
});