import { USER_DATA } from "./services/mockService.js";
import { navigateTo } from "./utils/transition.js"; // <--- Импорт


document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    if(window.Telegram?.WebApp) {
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.setHeaderColor('#ffffff');

        window.Telegram.WebApp.BackButton.hide();
    }


    const nameEl = document.getElementById('profile-name');
    const idEl = document.getElementById('profile-id');
    const avatarEl = document.getElementById('profile-avatar');
    const premiumBadge = document.getElementById('profile-premium');

    if (USER_DATA) {
        nameEl.textContent = USER_DATA.name;
        idEl.textContent = USER_DATA.userId;
        

        if(USER_DATA.avatar) {
            avatarEl.src = USER_DATA.avatar;
        }
        
        if(USER_DATA.isPremium) {
            premiumBadge.classList.remove('hidden')
        }
    }
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