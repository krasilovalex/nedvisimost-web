import { ADS_DATA } from "./services/mockService.js";
import { navigateTo } from "./utils/transition.js"; // <--- Импорт


const container = document.getElementById('fav-container')

window.removeFavorite = (event, id) => {
    event.stopPropagation();

    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(id);

    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    const card = document.getElementById(`fav-card-${id}`);
    if(card) {
        card.style.opacity = '0';
        setTimeout(()  => {
            renderFavorites();
        }, 300);
    }

    if(window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
    }
};

function createFavCard(ad) {
    const price = new Intl.NumberFormat('ru-RU').format(ad.price);
    const image = ad.photos && ad.photos.length > 0 ? ad.photos[0]  : ad.image;

    return `
        <div id="fav-card-${ad.id}" onclick="window.location.href='details.html?id=${ad.id}'" 
             class="bg-white rounded-[16px] p-2 shadow-sm border border-gray-100 flex flex-col group cursor-pointer transition-all duration-300">
            
            <div class="relative w-full h-32 rounded-xl overflow-hidden mb-2 bg-gray-200">
                <img src="${image}" class="w-full h-full object-cover">
                
                <button onclick="window.removeFavorite(event, ${ad.id})" 
                        class="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-sm active:scale-90 transition-transform">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path></svg>
                </button>
            </div>

            <div class="px-1">
                <div class="font-extrabold text-emerald-700 text-[15px]">${price} ₽</div>
                <div class="text-[12px] text-gray-800 font-medium line-clamp-2 mt-0.5">${ad.title}</div>
                <div class="text-[10px] text-gray-400 mt-1 truncate">${ad.address}</div>
            </div>
        </div>
    `;
}


function renderFavorites() {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');

    const likedAds = ADS_DATA.filter(ad => favoriteIds.includes(ad.id));

    if(likedAds.length === 0) {
        container.innerHTML = `
            <div class="col-span-2 flex flex-col items-center justify-center py-20 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                </div>
                <h3 class="text-gray-900 font-bold mb-1">Пока пусто</h3>
                <p class="text-xs text-gray-500">Добавляйте понравившиеся квартиры, <br>чтобы не потерять их.</p>
                <button onclick="window.location.href='index.html'" class="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-transform">
                    Искать
                </button>
            </div>
        `;

        container.classList.remove('grid', 'grid-cols-2');
        container.classList.add('flex', 'flex-col');
        return;
    }

    container.classList.add('grid', 'grid-cols-2');
    container.classList.remove('flex', 'flex-col');

    container.innerHTML = '';
    likedAds.forEach(ad => {

        container.insertAdjacentHTML('beforeend', createFavCard(ad));
    });

    container.className = "flex-1 px-3 py-3 grid grid-cols-2 gap-3 content-start pb-24";
}


document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    if(window.Telegram?.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setHeaderColor('#ffffff');
        window.Telegram.WebApp.BackButton.hide();
    }
    renderFavorites();
})

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