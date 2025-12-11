// mockService.js

export const USER_DATA = {
    userId: 42391,
    telegramId: 912331231,
    name: "Алексей",
    isPremium: true,
    avatar: "https://ui-avatars.com/api/?name=Alexey&background=10b981&color=fff"
};

export const ADS_DATA = [
    // 1. Продажа, Собственник, Москва, 2-шка
    {
        id: 1,
        title: "2-к кв, 45 м², 2/5 эт.",
        price: 12500000,
        address: "Москва, ул. Ленина 10",
        type: "buy",
        source: "user",
        contactInfo: "Пишите в тг @vika_owner",
        description: "Уютная квартира в центре. Рядом парк, школа и метро. Сделан евроремонт, остаётся вся мебель.",
        // Параметры для фильтров
        area: 45,
        floor: 2,
        house_type: "brick",
        renovation: "euro",
        balcony: true,
        
        owner: { name: "Виктория", avatar: "https://ui-avatars.com/api/?name=Vika&background=random" },
        photos: [
            "https://loremflickr.com/600/400/livingroom?random=1",
            "https://loremflickr.com/600/400/kitchen?random=1"
        ],
        isFavorite: false,
        ai: { available: true }
    },

    // 2. Аренда, Агент (Парсинг), Химки, Студия
    {
        id: 2,
        title: "Студия, 28 м², 12/25 эт.",
        price: 45000,
        address: "Химки, Молодежная 5",
        type: "rent",
        source: "parsed",
        contactInfo: "+7 900 111-22-33 (Агент)",
        description: "Сдается стильная студия. Только на длительный срок. Без животных.",
        
        area: 28,
        floor: 12,
        house_type: "monolith",
        renovation: "design",
        balcony: false,

        owner: { name: "Агентство 'Дом'", avatar: "" },
        photos: [
            "https://loremflickr.com/600/400/studio?random=2",
            "https://loremflickr.com/600/400/bathroom?random=2"
        ],
        isFavorite: true,
        ai: { available: false }
    },

    // 3. Продажа, Агент, Мытищи, 1-шка (Дешевая)
    {
        id: 3,
        title: "1-к кв, 38 м², 5/9 эт.",
        price: 7100000,
        address: "Мытищи, Мира 1",
        type: "buy",
        source: "parsed",
        contactInfo: "+7 999 000-00-03",
        description: "Простая квартира под ремонт. Свободная продажа.",
        
        area: 38,
        floor: 5,
        house_type: "panel",
        renovation: "none",
        balcony: true,

        owner: { name: "Риелтор Иван", avatar: "" },
        photos: ["https://loremflickr.com/600/400/emptyroom?random=3"],
        isFavorite: false,
        ai: { available: true }
    },

    // 4. Аренда, Собственник, Сити (Дорого)
    {
        id: 4,
        title: "Апартаменты Сити, 75 м²",
        price: 250000,
        address: "Москва, Пресненская наб. 8",
        type: "rent",
        source: "user",
        contactInfo: "@vip_rent_moscow",
        description: "Роскошный вид на город. Полный сервис. Уборка включена.",
        
        area: 75,
        floor: 45,
        house_type: "monolith",
        renovation: "design",
        balcony: false,

        owner: { name: "Максим", avatar: "https://ui-avatars.com/api/?name=Max&background=000" },
        photos: ["https://loremflickr.com/600/400/luxury?random=4", "https://loremflickr.com/600/400/view?random=4"],
        isFavorite: false,
        ai: { available: true }
    },

    // 5. Продажа, Собственник, Москва, 3-шка
    {
        id: 5,
        title: "3-к кв, 80 м², 7/12 эт.",
        price: 21500000,
        address: "Москва, Профсоюзная 15",
        type: "buy",
        source: "user",
        contactInfo: "+7 926 555-44-33",
        description: "Отличная трешка для семьи. Рядом парк Воронцово.",
        
        area: 80,
        floor: 7,
        house_type: "brick",
        renovation: "cosmetic",
        balcony: true,

        owner: { name: "Семья Ивановых", avatar: "" },
        photos: ["https://loremflickr.com/600/400/bedroom?random=5", "https://loremflickr.com/600/400/kidsroom?random=5"],
        isFavorite: false,
        ai: { available: true }
    },

    // 6. Аренда, Парсинг, Москва, 1-шка (Бабушкин вариант)
    {
        id: 6,
        title: "1-к кв, 33 м², 2/5 эт.",
        price: 35000,
        address: "Москва, Перово, Зеленая 3",
        type: "rent",
        source: "parsed",
        contactInfo: "Циан id123123",
        description: "Чистая квартира, бабушкин ремонт. Можно с кошкой.",
        
        area: 33,
        floor: 2,
        house_type: "panel",
        renovation: "none",
        balcony: true,

        owner: { name: "Агент", avatar: "" },
        photos: ["https://loremflickr.com/600/400/oldroom?random=6"],
        isFavorite: false,
        ai: { available: false }
    },

    // 7. Продажа, Собственник, Новая Москва, Студия
    {
        id: 7,
        title: "Студия, 24 м², 15/25 эт.",
        price: 6800000,
        address: "Москва, Коммунарка",
        type: "buy",
        source: "user",
        contactInfo: "Тг @kommunarka_sell",
        description: "Новый дом, ключи на руках. Без отделки.",
        
        area: 24,
        floor: 15,
        house_type: "monolith",
        renovation: "none",
        balcony: true,

        owner: { name: "Дмитрий", avatar: "" },
        photos: ["https://loremflickr.com/600/400/construction?random=7"],
        isFavorite: false,
        ai: { available: true }
    },

    // 8. Аренда, Собственник, Москва, 2-шка (Евро)
    {
        id: 8,
        title: "2-к кв, 55 м², 4/9 эт.",
        price: 85000,
        address: "Москва, Кутузовский пр-т",
        type: "rent",
        source: "user",
        contactInfo: "+7 999 888-77-66",
        description: "Сталинка, высокие потолки. Дизайнерский ремонт.",
        
        area: 55,
        floor: 4,
        house_type: "brick",
        renovation: "design",
        balcony: false,

        owner: { name: "Елена", avatar: "https://ui-avatars.com/api/?name=Elena" },
        photos: ["https://loremflickr.com/600/400/livingroom?random=8", "https://loremflickr.com/600/400/kitchen?random=8"],
        isFavorite: true,
        ai: { available: true }
    },

    // 9. Продажа, Парсинг, Балашиха, 2-шка
    {
        id: 9,
        title: "2-к кв, 50 м², 9/17 эт.",
        price: 9200000,
        address: "Балашиха, Ленина 55",
        type: "buy",
        source: "parsed",
        contactInfo: "Агентство Недвижимость+",
        description: "Хороший район, рядом лес.",
        
        area: 50,
        floor: 9,
        house_type: "panel",
        renovation: "cosmetic",
        balcony: true,

        owner: { name: "Менеджер", avatar: "" },
        photos: ["https://loremflickr.com/600/400/room?random=9"],
        isFavorite: false,
        ai: { available: false }
    },

    // 10. Продажа, Собственник, Москва, 4-шка (Элит)
    {
        id: 10,
        title: "4-к кв, 120 м², 3/7 эт.",
        price: 45000000,
        address: "Москва, Остоженка",
        type: "buy",
        source: "user",
        contactInfo: "Звонить представителю +7...",
        description: "Клубный дом. Охрана, паркинг. Тихий центр.",
        
        area: 120,
        floor: 3,
        house_type: "monolith",
        renovation: "design",
        balcony: true,

        owner: { name: "Константин", avatar: "" },
        photos: ["https://loremflickr.com/600/400/mansion?random=10", "https://loremflickr.com/600/400/hall?random=10"],
        isFavorite: false,
        ai: { available: true }
    }
];

export const wait = (ms) => new Promise(r => setTimeout(r, ms));