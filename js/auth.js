// ===== BiBurn Auth Module =====
(function() {
  function getUser() {
    try { return JSON.parse(localStorage.getItem('bb_user')); } catch(e) { return null; }
  }

  function getCurrentPath() {
    return window.location.pathname;
  }

  function getLoginUrl() {
    // Figure out relative path to login.html
    const p = getCurrentPath();
    if (p.includes('/html/')) return 'login.html?from=' + encodeURIComponent(window.location.href);
    return 'html/login.html?from=' + encodeURIComponent(window.location.href);
  }

  function renderAuthNav() {
    const nav = document.querySelector('nav ul');
    if (!nav) return;

    // Remove existing auth item if any
    const existing = nav.querySelector('.nav-auth');
    if (existing) existing.remove();

    const li = document.createElement('li');
    li.className = 'nav-auth';

    const user = getUser();
    if (!user) {
      li.innerHTML = `<a href="${getLoginUrl()}" class="btn-login-nav">🔑 Đăng Nhập</a>`;
    } else {
      const isAdmin = user.role === 'admin';
      const adminLink = isAdmin
        ? `<a href="${getCurrentPath().includes('/html/') ? '' : 'html/'}admin.html" class="dropdown-item">⚙️ Trang Admin</a>`
        : '';
      li.innerHTML = `
        <button class="avatar-btn" id="avatarBtn" onclick="toggleDropdown(event)" title="${user.name}">
          👤<span class="avatar-badge"></span>
        </button>
        <div class="avatar-dropdown" id="avatarDropdown">
          <div class="dropdown-header">
            <div class="dh-name">👋 ${user.name}</div>
            <div class="dh-role">${isAdmin ? '⚙️ Quản trị viên' : 'Thành viên BiBurn'}</div>
          </div>
          <a href="${getCurrentPath().includes('/html/') ? '' : 'html/'}orders.html" class="dropdown-item">📋 Đơn Hàng Của Tôi</a>
          ${adminLink}
          <button class="dropdown-item danger" onclick="doLogout()">🚪 Đăng Xuất</button>
        </div>
      `;
    }
    nav.appendChild(li);
  }

  window.toggleDropdown = function(e) {
    e.stopPropagation();
    const dd = document.getElementById('avatarDropdown');
    if (dd) dd.classList.toggle('open');
  };

  window.doLogout = function() {
    localStorage.removeItem('bb_user');
    window.location.reload();
  };

  // Close dropdown on outside click
  document.addEventListener('click', function() {
    const dd = document.getElementById('avatarDropdown');
    if (dd) dd.classList.remove('open');
  });

  // Init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAuthNav);
  } else {
    renderAuthNav();
  }
})();
