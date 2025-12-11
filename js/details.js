import { ADS_DATA } from "./services/mockService.js";
import { navigateTo } from "./utils/transition.js"; // <--- Импорт

const container = document.getElementById('detail-container');

function getAdIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'))
}


function renderPage() {
    const id = getAdIdFromUrl();
    const ad = ADS_DATA.find(item => item.id === id);


    if (!ad) {
        container.innerHTML = `<div class="p-10 text-center text-gray-500">Объявление не найдено или удалено. <br> <a href="index.html" class="text-emerald-600 underline">На главную</a></div>`;
        return;
    }
    const aiIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM1.5 9.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM17.25 15a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM6 18a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM18.75 6a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Z" clip-rule="evenodd" /></svg>`;
    const price = new Intl.NumberFormat('ru-RU').format(ad.price);
    const imagesHtml = (ad.photos || []).map(src =>
        `<img src="${src}" class="w-full h-80 object-cover snap-center shrink-0">`
    ).join('');
    const contactText = ad.contactInfo || "Контакты скрыты";
    container.innerHTML = `
        <div class="flex overflow-x-auto snap-x scroll-smooth no-scrollbar bg-gray-200 h-80">
            ${imagesHtml}
        </div>

        <div class="p-5 bg-white -mt-6 relative rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] min-h-[50vh]">
            
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h1 class="text-2xl font-extrabold text-gray-900">${price} ₽</h1>
                    <p class="text-sm text-gray-500">${ad.type === 'rent' ? 'Аренда в месяц' : 'Продажа'}</p>
                </div>
                <button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 bg-gray-100 hover:text-red-500">
                    <svg class="w-6 h-6" fill="${ad.isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24" class="${ad.isFavorite ? 'text-red-500' : ''}">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </button>
            </div>
            
            <h2 class="text-lg font-medium leading-snug text-gray-800 mb-4">${ad.title}</h2>
            <div class="flex items-center gap-1 text-xs text-gray-500 mb-6">
                <span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-gray-300">
                      <path fill-rule="evenodd" d="m9.69 18.933.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.006.003.002.001.003.001.003-.001ZM10 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" clip-rule="evenodd" />
                   </svg></span> ${ad.address}
            </div>

            ${ad.ai?.available ? `
            <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-6 flex gap-3">
                <div class="bg-emerald-600 text-white p-3 rounded-lg h-fit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM1.5 9.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM17.25 15a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM6 18a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5ZM18.75 6a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Z" clip-rule="evenodd" /></svg></div>
                <div>
                    <div class="font-bold text-emerald-800 text-sm">AI Анализ</div>
                    <div class="text-[11px] text-emerald-600">Цена соответствует рынку.</div>
                </div>
            </div>` : ''}

            <h3 class="font-bold text-gray-900 mb-2">Описание</h3>
            <p class="text-sm text-gray-600 leading-relaxed mb-8 whitespace-pre-wrap">${ad.description || 'Описание отсутствует.'}</p>

            <div class="flex items-center gap-3 pt-6 border-t border-gray-100">
                <div class="w-12 h-12 rounded-full bg-gray-100 overflow-hidden">
                    <img src="${ad.owner?.avatar || 'https://placehold.co/100'}" class="w-full h-full object-cover">
                </div>
                <div>
                    <div class="font-bold text-gray-900">${ad.owner?.name || 'Владелец'}</div>
                    <div class="text-xs text-emerald-600 font-medium">Проверенный аккаунт</div>
                </div>
            </div>
        </div>
        <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40 safe-area-pb">
            <div class="flex flex-col gap-2">
                <div class="text-xs text-gray-400 text-center">Связь с продавцом</div>
                <div class="bg-emerald-50 text-emerald-900 font-bold py-3.5 rounded-xl border border-emerald-100 flex justify-center items-center gap-2 text-sm select-all cursor-text">
                    ${contactText}
                    <svg class="w-4 h-4 text-emerald-600 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
            </div>
        </div>

    `;
    
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    // Настраиваем Telegram BackButton
    if(window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        tg.BackButton.show();
        
        // При нажатии "Назад" в ТГ -> возвращаемся на index.html
        tg.BackButton.onClick(() => {
            window.history.back();
        });
    }

    renderPage();
});

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