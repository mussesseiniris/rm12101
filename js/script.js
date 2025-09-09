// 导航栏滚动效果
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.remove('nav-transparent');
        navbar.classList.add('nav-solid', 'py-4', 'shadow-lg');
    } else {
        navbar.classList.remove('nav-solid', 'py-4', 'shadow-lg');
        navbar.classList.add('nav-transparent', 'py-6');
    }
});

// 移动端菜单切换
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    const icon = menuBtn.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    }
});

// 点击移动端菜单项后关闭菜单
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        const icon = menuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// 滚动动画
const animateElements = document.querySelectorAll('[data-animate]');
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const animation = element.getAttribute('data-animate');
            const delay = element.getAttribute('data-delay') || 0;
            
            element.style.animationDelay = `${delay}ms`;
            
            if (animation === 'fade-in') {
                element.classList.add('animate-fade-in');
            } else if (animation === 'slide-up') {
                element.classList.add('animate-slide-up');
            }
            
            observer.unobserve(element);
        }
    });
}, observerOptions);

animateElements.forEach(element => {
    observer.observe(element);
});

// 作品筛选功能
const filterBtns = document.querySelectorAll('.filter-btn');
const artworkCards = document.querySelectorAll('.artwork-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有按钮的active类
        filterBtns.forEach(b => {
            b.classList.remove('active', 'bg-art-accent', 'text-art-dark');
            b.classList.add('bg-transparent', 'border', 'border-white/20', 'text-white/80');
        });
        
        // 给当前点击的按钮添加active类
        btn.classList.add('active', 'bg-art-accent', 'text-art-dark');
        btn.classList.remove('bg-transparent', 'border', 'border-white/20', 'text-white/80');
        
        const category = btn.textContent.trim();
        
        // 筛选作品
        artworkCards.forEach(card => {
            if (category === '全部作品' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                // 重新触发动画
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 50);
            } else {
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// 模态框功能
const modal = document.getElementById('artworkModal');
const modalContent = modal.querySelector('.modal-content');
const modalClose = modal.querySelector('.modal-close');
const modalTitle = modal.querySelector('.modal-title');
const modalCategory = modal.querySelector('.modal-category');
const modalDescription = modal.querySelector('.modal-description');
const modalYear = modal.querySelector('.modal-year');
const modalMedium = modal.querySelector('.modal-medium');
const modalImage = modal.querySelector('.modal-image');
const modalImageDesc = modal.querySelector('.modal-image-desc');
const modalImageCounter = modal.querySelector('.modal-image-counter');
const modalIndicators = modal.querySelector('.modal-indicators');
const prevBtn = modal.querySelector('.prev-btn');
const nextBtn = modal.querySelector('.next-btn');

let currentArtwork = null;
let currentImageIndex = 0;

// 打开模态框
document.querySelectorAll('.artwork-card a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const card = link.closest('.artwork-card');
        const dataElement = card.querySelector('.image-data');
        currentArtwork = JSON.parse(dataElement.textContent.trim());
        currentImageIndex = 0;
        
        // 填充模态框内容
        modalTitle.textContent = currentArtwork.title;
        modalCategory.textContent = currentArtwork.category;
        modalDescription.textContent = currentArtwork.description;
        modalYear.textContent = currentArtwork.year;
        modalMedium.textContent = currentArtwork.medium;
        
        // 加载图片和指示器
        loadModalImage(currentImageIndex);
        createImageIndicators();
        
        // 显示模态框
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// 关闭模态框
modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

// 点击模态框外部关闭
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// 加载指定索引的图片
function loadModalImage(index) {
    if (!currentArtwork || !currentArtwork.images[index]) return;
    
    const image = currentArtwork.images[index];
    modalImage.style.opacity = '0';
    
    // 图片加载完成后显示
    modalImage.onload = () => {
        modalImage.style.opacity = '1';
    };
    
    modalImage.src = image.src;
    modalImage.alt = currentArtwork.title;
    modalImageDesc.textContent = image.desc;
    modalImageCounter.textContent = `${index + 1} / ${currentArtwork.images.length}`;
    
    // 更新指示器状态
    updateIndicators(index);
}

// 创建图片指示器
function createImageIndicators() {
    modalIndicators.innerHTML = '';
    
    if (!currentArtwork) return;
    
    currentArtwork.images.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('modal-indicator');
        if (index === currentImageIndex) {
            indicator.classList.add('active');
        }
        
        indicator.addEventListener('click', () => {
            currentImageIndex = index;
            loadModalImage(currentImageIndex);
        });
        
        modalIndicators.appendChild(indicator);
    });
}

// 更新指示器状态
function updateIndicators(activeIndex) {
    const indicators = modalIndicators.querySelectorAll('.modal-indicator');
    indicators.forEach((indicator, index) => {
        if (index === activeIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// 上一张图片
prevBtn.addEventListener('click', () => {
    if (!currentArtwork) return;
    
    currentImageIndex = (currentImageIndex - 1 + currentArtwork.images.length) % currentArtwork.images.length;
    loadModalImage(currentImageIndex);
});

// 下一张图片
nextBtn.addEventListener('click', () => {
    if (!currentArtwork) return;
    
    currentImageIndex = (currentImageIndex + 1) % currentArtwork.images.length;
    loadModalImage(currentImageIndex);
});

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + currentArtwork.images.length) % currentArtwork.images.length;
        loadModalImage(currentImageIndex);
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % currentArtwork.images.length;
        loadModalImage(currentImageIndex);
    }
});