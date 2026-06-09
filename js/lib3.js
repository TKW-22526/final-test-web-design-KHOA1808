  function setContactError(id, msg) {
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

  function sendMsg() {
    const name = document.getElementById('msgName').value.trim();
    const email = document.getElementById('msgEmail').value.trim();
    const body = document.getElementById('msgBody').value.trim();

    let hasError = false;
    setContactError('msgName', '');
    setContactError('msgEmail', '');
    setContactError('msgBody', '');

    if (!name) { setContactError('msgName', '⚠️ Vui lòng nhập họ và tên'); hasError = true; }
    if (!email) {
      setContactError('msgEmail', '⚠️ Vui lòng nhập email'); hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setContactError('msgEmail', '⚠️ Email không hợp lệ (VD: ten@gmail.com)'); hasError = true;
    }
    if (!body) { setContactError('msgBody', '⚠️ Vui lòng nhập nội dung tin nhắn'); hasError = true; }
    if (hasError) return;

    showToast('✅ Đã gửi tin nhắn! Chúng tôi sẽ phản hồi sớm.');
    document.getElementById('msgName').value = '';
    document.getElementById('msgEmail').value = '';
    document.getElementById('msgSubject').value = '';
    document.getElementById('msgBody').value = '';
  }
  updateCartBadge();
