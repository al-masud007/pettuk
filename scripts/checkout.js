let basket = JSON.parse(localStorage.getItem('pettukBasket')) || [];

const DELIVERY = 40;
const SERVICE_RATE = 0.03;

const dishPhotos = {
    '101': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400',
    '102': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
    '103': 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=400',
    '104': 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
    '201': 'https://images.unsplash.com/photo-1545247181-516773cae754?w=400',
    '202': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    '203': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    '204': 'https://images.unsplash.com/photo-1547928578-bca3e9c5a0ab?w=400',
    '301': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400',
    '302': 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400',
    '303': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
    '304': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=400',
    '401': 'https://images.unsplash.com/photo-1666190077557-ce39b4fce09d?w=400',
    '402': 'https://images.unsplash.com/photo-1605197161470-5f2c7a4c2d83?w=400',
    '403': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    '404': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    '501': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    '502': 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400',
    '503': 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400',
    '504': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=400'
};

const basketContainer = document.getElementById('basketItems');
const emptyEl = document.getElementById('emptyBasket');
const itemsTotalEl = document.getElementById('itemsTotal');
const deliveryEl = document.getElementById('deliveryCharge');
const serviceFeeEl = document.getElementById('serviceFee');
const grandTotalEl = document.getElementById('grandTotal');
const badgeEl = document.querySelector('.basket-badge');
const confirmBtn = document.getElementById('confirmOrder');
const mobileToggle = document.querySelector('.mobile-toggle');
const navLinks = document.querySelector('.nav-links');

function drawBasket() {
    if (basket.length === 0) {
        basketContainer.classList.add('hidden');
        emptyEl.classList.remove('hidden');
        document.querySelector('.billing-section').classList.add('hidden');
        return;
    }

    basketContainer.classList.remove('hidden');
    emptyEl.classList.add('hidden');
    document.querySelector('.billing-section').classList.remove('hidden');
    basketContainer.innerHTML = '';

    basket.forEach(item => {
        let lineTotal = item.cost * item.qty;
        let photo = dishPhotos[item.id] || 'https://via.placeholder.com/85';

        let html = `
            <div class="basket-item" data-id="${item.id}">
                <img src="${photo}" alt="${item.title}" class="basket-item-img">
                <div class="basket-item-info">
                    <div class="basket-item-title">${item.title}</div>
                    <div class="basket-item-price">৳${item.cost} each</div>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn minus">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn plus">+</button>
                </div>
                <div class="basket-item-total">৳${lineTotal}</div>
                <button class="remove-item">Remove</button>
            </div>
        `;
        basketContainer.innerHTML += html;
    });

    bindActions();
    calcBill();
}

function bindActions() {
    document.querySelectorAll('.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            let id = this.closest('.basket-item').dataset.id;
            changeQty(id, 1);
        });
    });

    document.querySelectorAll('.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            let id = this.closest('.basket-item').dataset.id;
            changeQty(id, -1);
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            let id = this.closest('.basket-item').dataset.id;
            dropItem(id);
        });
    });
}

function changeQty(id, delta) {
    let item = basket.find(x => x.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            dropItem(id);
            return;
        }
        persist();
        drawBasket();
    }
}

function dropItem(id) {
    basket = basket.filter(x => x.id !== id);
    persist();
    drawBasket();
}

function persist() {
    localStorage.setItem('pettukBasket', JSON.stringify(basket));
    refreshBadge();
}

function refreshBadge() {
    let count = basket.reduce((acc, x) => acc + x.qty, 0);
    badgeEl.textContent = count;
}

function calcBill() {
    let itemsTotal = basket.reduce((acc, x) => acc + (x.cost * x.qty), 0);
    let service = Math.round(itemsTotal * SERVICE_RATE);
    let grand = itemsTotal + DELIVERY + service;

    itemsTotalEl.textContent = '৳' + itemsTotal;
    deliveryEl.textContent = '৳' + DELIVERY;
    serviceFeeEl.textContent = '৳' + service;
    grandTotalEl.textContent = '৳' + grand;
}

confirmBtn.addEventListener('click', function() {
    if (basket.length === 0) {
        alert('Your basket is empty!');
        return;
    }
    basket = [];
    persist();
    document.getElementById('orderSuccess').classList.remove('hidden');
});

mobileToggle.addEventListener('click', function() {
    navLinks.classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', function() {
    drawBasket();
    refreshBadge();
});
