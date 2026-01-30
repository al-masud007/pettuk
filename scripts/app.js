let basket = JSON.parse(localStorage.getItem('pettukBasket')) || [];

const badgeEl = document.querySelector('.basket-badge');
const searchField = document.getElementById('foodSearch');
const filterPills = document.querySelectorAll('.filter-pill');
const dishItems = document.querySelectorAll('.dish-item');
const dishGroups = document.querySelectorAll('.dish-group');
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

function refreshBadge() {
    let count = basket.reduce((acc, item) => acc + item.qty, 0);
    badgeEl.textContent = count;
    localStorage.setItem('pettukBasket', JSON.stringify(basket));
}

function putInBasket(id, title, cost) {
    let found = basket.find(x => x.id === id);
    if (found) {
        found.qty += 1;
    } else {
        basket.push({ id, title, cost: parseFloat(cost), qty: 1 });
    }
    refreshBadge();
    toast(title + ' added to basket!');
}

function toast(msg) {
    let el = document.createElement('div');
    el.textContent = msg;
    el.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-dark, #4A3570);
        color: #fff;
        padding: 14px 28px;
        border-radius: 10px;
        font-weight: 500;
        z-index: 9999;
        animation: fadeUp 0.3s ease;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
}

function orderNow(id, title, cost) {
    basket = [{ id, title, cost: parseFloat(cost), qty: 1 }];
    localStorage.setItem('pettukBasket', JSON.stringify(basket));
    window.location.href = 'checkout.html';
}

function applyFilter(type, btn) {
    filterPills.forEach(p => p.classList.remove('selected'));
    btn.classList.add('selected');

    if (type === 'all') {
        dishGroups.forEach(g => g.classList.remove('hidden'));
        dishItems.forEach(d => d.classList.remove('hidden'));
    } else {
        dishGroups.forEach(g => {
            g.dataset.type === type ? g.classList.remove('hidden') : g.classList.add('hidden');
        });
        dishItems.forEach(d => d.classList.remove('hidden'));
    }
}

function searchDishes(term) {
    term = term.toLowerCase().trim();

    filterPills.forEach(p => p.classList.remove('selected'));
    document.querySelector('.filter-pill[data-filter="all"]').classList.add('selected');

    if (!term) {
        dishItems.forEach(d => d.classList.remove('hidden'));
        dishGroups.forEach(g => g.classList.remove('hidden'));
        return;
    }

    dishGroups.forEach(g => g.classList.remove('hidden'));
    dishItems.forEach(d => d.classList.remove('hidden'));

    dishItems.forEach(d => {
        let name = d.dataset.title.toLowerCase();
        let type = d.dataset.type.toLowerCase();
        (name.includes(term) || type.includes(term)) ? d.classList.remove('hidden') : d.classList.add('hidden');
    });

    dishGroups.forEach(g => {
        let visible = g.querySelectorAll('.dish-item:not(.hidden)');
        visible.length === 0 ? g.classList.add('hidden') : g.classList.remove('hidden');
    });
}

function setActiveNav() {
    let links = document.querySelectorAll('.nav-links .link:not(.basket-link)');
    let dishesSection = document.getElementById('dishes');
    let scrollY = window.scrollY + 160;

    if (dishesSection && scrollY >= dishesSection.offsetTop) {
        links.forEach(l => l.classList.remove('current'));
        document.querySelector('.link[href="#dishes"]').classList.add('current');
    } else {
        links.forEach(l => l.classList.remove('current'));
        document.querySelector('.link[href="index.html"]').classList.add('current');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    refreshBadge();

    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', function() {
            let item = this.closest('.dish-item');
            putInBasket(item.dataset.id, item.dataset.title, item.dataset.cost);
        });
    });

    document.querySelectorAll('.btn-order').forEach(btn => {
        btn.addEventListener('click', function() {
            let item = this.closest('.dish-item');
            orderNow(item.dataset.id, item.dataset.title, item.dataset.cost);
        });
    });

    filterPills.forEach(pill => {
        pill.addEventListener('click', function() {
            applyFilter(this.dataset.filter, this);
        });
    });

    searchField.addEventListener('input', function() {
        searchDishes(this.value);
    });

    document.getElementById('searchBtn').addEventListener('click', function() {
        searchDishes(searchField.value);
    });

    mobileToggle.addEventListener('click', function() {
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-links .link:not(.basket-link)').forEach(link => {
        link.addEventListener('click', function() {
            document.querySelectorAll('.nav-links .link').forEach(l => l.classList.remove('current'));
            this.classList.add('current');
            navLinks.classList.remove('open');
        });
    });

    window.addEventListener('scroll', setActiveNav);
});

let toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes fadeUp {
        from { opacity: 0; transform: translate(-50%, 20px); }
        to { opacity: 1; transform: translate(-50%, 0); }
    }
`;
document.head.appendChild(toastStyle);
