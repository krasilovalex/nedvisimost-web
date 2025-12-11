import { ADS_DATA, USER_DATA, wait } from "./services/mockService.js";
import { navigateTo } from "./utils/transition.js";


const adsContainer = document.getElementById('ads-container');
const avatarImg = document.getElementById('user-avatar');

// Текущий фильтр
let currentType = 'buy'; 

// === 1. ГЕНЕРАЦИЯ КАРУСЕЛИ (Слайды + Точки + Иконки поверх) ===
function createCarouselHTML(ad) {
    const photos = ad.photos || [];

    // Слайды
    const slides = photos.map((src, index) => `
        <div class="snap-center shrink-0 w-full h-full relative bg-gray-200">
            <img src="${src}" class="w-full h-full object-cover pointer-events-none" loading="lazy">
        </div> 
    `).join('');

    // Точки (Пузырьки)
    const dots = photos.length > 1 ? `
    <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
        ${photos.map((_, i) => `
            <div class="w-1.5 h-1.5 rounded-full backdrop-blur-sm transition-all shadow-sm ${i === 0 ? 'bg-white w-3' : 'bg-white/50'}"
                 data-index="${i}"></div>
        `).join('')}
     </div>` : '';

    // Иконка AI
    const aiIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM1.5 9.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM17.25 15a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM6 18a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM18.75 6a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Z" clip-rule="evenodd" /></svg>`;
    const aiBadge = ad.ai && ad.ai.available 
        ? `<div class="absolute top-2 left-2 bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1 pointer-events-none z-20">
             ${aiIcon} <span>AI REPORT</span>
           </div>` 
        : '';

    // Иконка Сердца

    const favorites = JSON.parse(localStorage.getItem('favorites') || "[]");
    const isFav = favorites.includes(ad.id);

    const heartSvg = isFav
        ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-red-500"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" /></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-gray-500 hover:text-red-500 transition-colors"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`;
    // Возвращаем один контейнер карусели
    return `<div class="relative w-full h-32 rounded-xl overflow-hidden mb-2 shrink-0 group transform transition-transform">
            
            <div class="flex w-full h-full overflow-x-auto snap-x no-scrollbar scroll-smooth" 
                 id="carousel-${ad.id}"
                 onscroll="window.updateDots(this, ${ad.id})">
                ${slides}
            </div>
            
            ${aiBadge}
            <div id="dots-${ad.id}">${dots}</div>

            <button onclick="window.toggleFavorite(event, ${ad.id})" class="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform z-20">
                ${heartSvg}
            </button>
        </div>
    `;
}

// === 2. ГЕНЕРАЦИЯ КАРТОЧКИ (Исправлено: убрали дубль картинки) ===
// main.js

function createCardHTML(ad) {
    const price = new Intl.NumberFormat('ru-RU').format(ad.price || 0);
    const address = ad.address || 'Адрес скрыт';
    const typeLabel = ad.type === 'rent' ? '<span class="text-xs font-normal text-gray-500">/мес</span>' : '';

    // Лайки
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFav = favorites.includes(ad.id);
    const heartColor = isFav ? 'text-red-500' : 'text-gray-400';
    const heartFill = isFav ? 'currentColor' : 'none';

    // === БЕЙДЖИК СОБСТВЕННИК (Твой код) ===
    const isVerified = ad.source === 'user';
    const verifiedBadge = isVerified 
        ? `<div class="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
             <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <span>Собственник</span>
           </div>`
        : '<span class="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Проверено</span>'; 
        // ^ Если не собственник, оставляем старую плашку "Проверено" или пустоту

    return `
        <div onclick="window.onCardClick(${ad.id})" class="bg-white rounded-[16px] p-2 shadow-sm border border-gray-100 flex flex-col h-auto group cursor-pointer hover:border-emerald-200 transition-colors">
            
            ${createCarouselHTML(ad)}

            <div class="flex flex-col gap-0.5 px-1">
                <div class="font-extrabold text-emerald-700 text-[15px] leading-tight">
                    ${price} ₽ ${typeLabel}
                </div>
                <div class="text-[12px] text-gray-800 font-medium leading-tight line-clamp-2 min-h-[2.5em]">${ad.title}</div>
                
                <div class="text-[10px] text-gray-400 truncate flex items-center gap-1 mt-1">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 text-gray-300">
                      <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.006.003.002.001.003.001.003-.001ZM10 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" clip-rule="evenodd" />
                   </svg>
                   ${address}
                </div>
            </div>

            <div class="mt-3 flex items-center justify-between px-1 pt-2 border-t border-gray-50">
                
                ${verifiedBadge}
                
                <button onclick="window.toggleFavorite(event, ${ad.id})" class="w-7 h-7 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-emerald-600 hover:text-white transition-all group-hover:bg-emerald-600 group-hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="${heartFill}" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 ${heartColor}" >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// 3. Отрисовка
function renderAds() {
    adsContainer.innerHTML = '';
    
    // Фильтр
    const filtered = ADS_DATA.filter(ad => ad.type === currentType);

    if (filtered.length === 0) {
        adsContainer.innerHTML = '<div class="col-span-2 text-center text-gray-400 py-10">В этой категории пока пусто 😔</div>';
        return;
    }

    filtered.forEach(ad => {
        adsContainer.insertAdjacentHTML('beforeend', createCardHTML(ad));
    });
}

// 4. Инициализация
async function init() {
    document.body.classList.add('loaded');
    try {
        // 1. СРАЗУ ИЩЕМ СПЛЕШ И ПРОВЕРЯЕМ СЕССИЮ
        const splash = document.getElementById('splash-screen');
        const isAppLaunched = sessionStorage.getItem('app_launched');

        if (isAppLaunched) {
            // Если уже заходили - СКРЫВАЕМ МГНОВЕННО
            if (splash) {
                splash.style.display = 'none';
            }
        } else {
            // Если это первый вход - ждем (имитируем загрузку)
            await wait(1500); 
            
            if (splash) {
                splash.style.opacity = '0'; // Плавное исчезновение
                setTimeout(() => splash.remove(), 500);
            }
            // Запоминаем, что мы тут были
            sessionStorage.setItem('app_launched', 'true');
        }

        // 2. Инициализация Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.expand();
            window.Telegram.WebApp.setHeaderColor('#ffffff');
            window.Telegram.WebApp.setBackgroundColor('#f9fafb');
        }

        // 3. Загружаем данные пользователя
        if(avatarImg && USER_DATA.avatar) {
            avatarImg.src = USER_DATA.avatar;
            avatarImg.classList.remove('opacity-0');
        }

        if(USER_DATA) {
            localStorage.setItem('user-info', JSON.stringify(USER_DATA));
        }

        // 4. Логика кнопки создания
        const createBtn = document.getElementById('create-ad-btn');
        if (createBtn) {
            createBtn.addEventListener('click', () => {
                console.log("Переход на создание объявления");
                navigateTo('create.html');
            });
        }

        // 5. Настройка контейнера и рендер
        adsContainer.className = "flex-1 px-3 py-3 grid grid-cols-2 gap-3 content-start pb-24";
        
        // Небольшая задержка перед рендером, чтобы было плавнее (только если первый вход)
        if (!isAppLaunched) await wait(300);

        window.switchType('buy');

    } catch (error) {
        console.error(error);
        adsContainer.innerHTML = `<div class="col-span-2 text-red-500 p-4 text-xs text-center">${error.message}</div>`;
    }
}

// === ГЛОБАЛЬНЫЕ ФУНКЦИИ ===
// Перехват кликов по меню для анимации
document.querySelectorAll('nav button').forEach(btn => {
    const onclick = btn.getAttribute('onclick');
    if (onclick && onclick.includes('window.location.href')) {
        btn.removeAttribute('onclick'); // Убираем старый клик
        // Достаем URL из строки (грубый парсинг, но сработает)
        const url = onclick.split("'")[1]; 
        
        btn.addEventListener('click', () => {
            navigateTo(url);
        });
    }
});


window.onCardClick = (id) => {
    console.log("Открываем объявление: ", id);
    navigateTo(`details.html?id=${id}`)
};


window.updateDots = (container, adId) => {
    const scrollLeft = container.scrollLeft;
    const width = container.offsetWidth;
    const index = Math.round(scrollLeft / width);
    
    const dotsContainer = document.getElementById(`dots-${adId}`);
    if (!dotsContainer) return;
    
    const dots = dotsContainer.querySelectorAll('div[data-index]');
    dots.forEach(dot => {
        const i = parseInt(dot.getAttribute('data-index'));
        if (i === index) {
            dot.className = "w-3 h-1.5 rounded-full bg-white transition-all shadow-sm"; 
        } else {
            dot.className = "w-1.5 h-1.5 rounded-full bg-white/50 backdrop-blur-sm transition-all";
        }
    });
};

window.switchType = (type) => {
    currentType = type;
    
    const btnBuy = document.getElementById('btn-buy');
    const btnRent = document.getElementById('btn-rent');
    
    // Проверка, существуют ли кнопки (чтобы не было ошибки)
    if(btnBuy && btnRent) {
        if (type === 'buy') {
            btnBuy.className = "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all bg-white shadow-sm text-gray-900";
            btnRent.className = "flex-1 py-1.5 text-xs font-medium rounded-lg transition-all text-gray-500 hover:text-gray-900";
        } else {
            btnRent.className = "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all bg-white shadow-sm text-gray-900";
            btnBuy.className = "flex-1 py-1.5 text-xs font-medium rounded-lg transition-all text-gray-500 hover:text-gray-900";
        }
    }

    renderAds();
};


// === LIKE SYSTEMS

function getFavorites() {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
}

window.toggleFavorite = (event, id) => {
    event.stopPropagation();

    const btn = event.currentTarget;
    const icon = btn.querySelector('svg');

    let favorites = getFavorites();
    const index = favorites.indexOf(id)

    if (index === -1) {
        favorites.push(id)

        icon.setAttribute('fill', 'currentColor');
        icon.classList.add('text-red-500');
        icon.classList.remove('text-gray-400')

        if(window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    } else {
        favorites.splice(index, 1);
        icon.setAttribute('fill', 'none');
        icon.classList.remove('text-red-500');
        icon.classList.add('text-gray-400');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    console.log('Избранное:', favorites);

};


let selectedRooms = [];


window.toggleFilters = (show) => {
    const modal = document.getElementById('filters-modal');
    const backdrop = document.getElementById('filters-backdrop');
    const content = document.getElementById('filters-content');

    if (show) {
        modal.classList.remove('hidden');

        setTimeout(() => {
            backdrop.classList.remove('opacity-0');
            content.classList.remove('translate-y-full');
        }, 10);
    } else {
        backdrop.classList.add('opacity-0');
        content.classList.add('translate-y-full');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300)
    }
};

window.toggleRoom = (btn, val) => {
    if (selectedRooms.includes(val)) {
        selectedRooms = selectedRooms.filter(r => r !== val);
        btn.classList.remove('bg-emerald-600', 'text-white', "border-emerald-600");
        btn.classList.add('text-gray-600', 'border-gray-200');
    } else {
        selectedRooms.push(val);
        btn.classList.add('bg-emerald-600', 'text-white', "border-emerald-600");
        btn.classList.remove('text-gray-600', 'border-gray-200');
    }
};

window.applyFilters = () => {
    try {
        console.log("--- ЗАПУСК ФИЛЬТРАЦИИ ---");

        // 1. Считываем значения (БЕЗОПАСНО)
        const cityEl = document.getElementById('f-city');
        const metroEl = document.getElementById('f-metro');
        
        const city = cityEl ? cityEl.value.toLowerCase().trim() : "";
        const metro = metroEl ? metroEl.value.toLowerCase().trim() : "";
        
        const minPrice = parseInt(document.getElementById('f-price-min')?.value) || 0;
        const maxPrice = parseInt(document.getElementById('f-price-max')?.value) || Infinity;
        
        const minArea = parseInt(document.getElementById('f-area-min')?.value) || 0;
        const maxArea = parseInt(document.getElementById('f-area-max')?.value) || Infinity;
        
        const minFloor = parseInt(document.getElementById('f-floor-min')?.value) || 0;
        const maxFloor = parseInt(document.getElementById('f-floor-max')?.value) || Infinity;
        
        const houseType = document.getElementById('f-house-type')?.value || "";
        const renovation = document.getElementById('f-renovation')?.value || "";
        
        const hasBalcony = document.getElementById('f-balcony')?.checked || false;
        const onlyWithPhoto = document.getElementById('f-photo')?.checked || false;
        const onlyOwner = document.getElementById('f-owner')?.checked || false;
        
        // Вот здесь была ошибка раньше (если ID нет, вернем false)
        const onlyVerified = document.getElementById('f-verified')?.checked || false;
        
        const sortType = document.getElementById('f-sort')?.value || "newest";

        // Закрываем окно
        window.toggleFilters(false);
        adsContainer.innerHTML = '';

        // 2. Фильтруем
        let filtered = ADS_DATA.filter(ad => {
            // Тип сделки (Купить/Снять)
            if (ad.type !== currentType) return false;

            // Локация
            if (city && !ad.address.toLowerCase().includes(city)) return false;
            if (metro && !ad.address.toLowerCase().includes(metro)) return false;

            // Цена
            if (ad.price < minPrice || ad.price > maxPrice) return false;

            // Площадь (проверка на undefined важна)
            if (typeof ad.area !== 'undefined') {
                if (ad.area < minArea || ad.area > maxArea) return false;
            }
            
            // Этаж
            if (typeof ad.floor !== 'undefined') {
                if (ad.floor < minFloor || ad.floor > maxFloor) return false;
            }
            
            // Тип дома
            if (houseType && ad.house_type && ad.house_type !== houseType) return false;
            
            // Ремонт
            if (renovation && ad.renovation && ad.renovation !== renovation) return false;
            
            // Балкон (если ищем с балконом, а его нет -> скрываем)
            if (hasBalcony && ad.balcony === false) return false; 

            // Фото
            if (onlyWithPhoto && (!ad.photos || ad.photos.length === 0)) return false;

            // Собственник (Source = 'user')
            if (onlyOwner && ad.source !== 'user') return false;

            // Проверенные (Premium)
            if (onlyVerified && ad.source !== 'user') return false;

            // Комнаты
            if (selectedRooms.length > 0) {
                let matchRoom = false;
                const title = ad.title.toLowerCase();
                
                selectedRooms.forEach(r => {
                    if (r === 'studio' && title.includes('студия')) matchRoom = true;
                    if (r === '1' && title.includes('1-к')) matchRoom = true;
                    if (r === '2' && title.includes('2-к')) matchRoom = true;
                    if (r === '3' && title.includes('3-к')) matchRoom = true;
                    if (r === '4+' && (title.includes('4-к') || title.includes('5-к'))) matchRoom = true;
                });
                
                if (!matchRoom) return false;
            }

            return true;
        });

        console.log(`Найдено: ${filtered.length} шт.`);

        // 3. Сортируем
        if (sortType === 'price_asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortType === 'price_desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortType === 'area_desc') {
            filtered.sort((a, b) => (b.area || 0) - (a.area || 0));
        }

        // 4. Рисуем
        if (filtered.length === 0) {
            adsContainer.innerHTML = `
                <div class="col-span-2 flex flex-col items-center justify-center py-20 text-center">
                    <span class="text-4xl mb-2">🔍</span>
                    <p class="text-gray-500 font-medium">Ничего не найдено</p>
                    <p class="text-xs text-gray-400 mt-1">Попробуйте смягчить фильтры</p>
                    <button onclick="window.location.reload()" class="mt-4 text-emerald-600 font-bold text-sm">Сбросить всё</button>
                </div>`;
        } else {
            filtered.forEach(ad => {
                adsContainer.insertAdjacentHTML('beforeend', createCardHTML(ad));
            });
        }
    } catch (e) {
        console.error("Ошибка фильтрации:", e);
        alert("Ошибка фильтров: " + e.message);
    }
};


document.addEventListener('DOMContentLoaded', init);