import { navigateTo } from "./utils/transition.js"; // <--- Импорт
// ... (начало create.js) ...
    document.body.classList.add('loaded');
    const form = document.getElementById('create-ad-form');
    // Получаем наше новое модальное окно
    const modal = document.getElementById('success-modal');
    const modalBtn = document.getElementById('modal-close-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-pulse">Отправка...</span>`;
        
        // Сбор данных
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.status = 'moderation'; 
        data.created_at = new Date().toISOString();
        data.user_id = 42391;

        console.log("Данные:", data);

        // Имитация сети
        await new Promise(r => setTimeout(r, 1500));

        // === ВМЕСТО tg.showPopup ПОКАЗЫВАЕМ НАШЕ ОКНО ===
        
        // 1. Убираем класс hidden
        modal.classList.remove('hidden');
        
        // 2. Небольшая задержка, чтобы сработала CSS анимация появления (opacity)
        setTimeout(() => {
            modal.classList.remove('opacity-0'); // Плавное появление фона
            modal.firstElementChild.classList.remove('scale-95'); // Плавное увеличение карточки
            modal.firstElementChild.classList.add('scale-100');
        }, 10);

        // 3. Вибрация для тактильного отклика (если доступно в ТГ)
        if(window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
    });

    // Обработка клика по кнопке "Отлично" в модалке
    modalBtn.addEventListener('click', () => {
        // Уходим на главную
        navigateTo('index.html');
    });

    // ... (конец create.js)

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