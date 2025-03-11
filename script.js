document.addEventListener('DOMContentLoaded', function() {
    // バーガーメニューの機能
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    // メニューアイコンの作成
    const menuIcon = document.createElement('div');
    menuIcon.className = 'menu-icon';
    mobileMenuBtn.innerHTML = '';
    mobileMenuBtn.appendChild(menuIcon);

    // アクセシビリティ属性の設定
    mobileMenuBtn.setAttribute('aria-label', 'メニューを開く');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('role', 'button');
    mobileMenuBtn.setAttribute('tabindex', '0');

    function toggleMenu() {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'メニューを開く' : 'メニューを閉じる');
        
        // スクロール制御
        if (!isExpanded) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // タッチイベントの最適化
    let touchStartY;
    
    mobileMenuBtn.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    mobileMenuBtn.addEventListener('touchend', function(e) {
        const touchEndY = e.changedTouches[0].clientY;
        const touchDiff = touchEndY - touchStartY;
        
        if (Math.abs(touchDiff) < 5) { // 5px以内のタッチはクリックとして処理
            e.preventDefault();
            toggleMenu();
        }
    });

    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // メニュー項目クリック時に閉じる
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // キーボードナビゲーション
    mobileMenuBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            toggleMenu();
        }
    });

    // 画面リサイズ時の処理
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        }, 250);
    });

    // ビデオの遅延読み込み
    const videos = document.querySelectorAll('iframe[data-src]');
    const loadVideo = (video) => {
        if (video.dataset.src) {
            video.src = video.dataset.src;
        }
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadVideo(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    videos.forEach(video => observer.observe(video));
}); 