export const onlineFoodStrings: Record<string, { ru: string; kk: string; en: string }> = {
  onlineFood: {
    ru: 'Найти брендовый продукт в интернете',
    kk: 'Бренд өнімін интернеттен іздеу',
    en: 'Search branded food online',
  },
  onlineFoodPrivacy: {
    ru: 'Запрос отправляется в Open Food Facts, а при отсутствии результата — в USDA (предпросмотр). Сервисы видят текст поиска и IP; профиль и дневник не отправляются.',
    kk: 'Сұрау Open Food Facts-ке, нәтиже болмаса USDA-ға (алдын ала қарау) жіберіледі. Олар іздеу мәтіні мен IP көреді; профиль мен күнделік жіберілмейді.',
    en: 'Your query goes to Open Food Facts, then USDA (preview) if no result is found. They receive the query and IP, never your profile or diary.',
  },
  onlineFoodEmpty: {
    ru: 'Полных карточек не найдено. Попробуй другое название, локальный каталог или ввод по упаковке.',
    kk: 'Толық карточка табылмады. Басқа атауды, жергілікті каталогты не қаптама деректерін қолданыңыз.',
    en: 'No complete records found. Try another name, the local catalog or values from the package.',
  },
  onlineFoodCheck: {
    ru: 'Сверь продукт и значения на 100 г с упаковкой. Неполные карточки не используются. Для жидкости проверь единицу измерения.',
    kk: 'Өнім мен 100 г мәндерін қаптамамен салыстырыңыз. Толық емес карточкалар қолданылмайды. Сұйықтық бірлігін тексеріңіз.',
    en: 'Check the exact product and per-100g values against its label. Incomplete records are excluded. Check the measurement unit for liquids.',
  },
  onlineFoodLimit: {
    ru: 'Лимит запросов. Подожди и повтори; локальный каталог доступен.',
    kk: 'Сұрау шегі. Күтіп, қайталаңыз; жергілікті каталог қолжетімді.',
    en: 'Request limit reached. Wait and retry; the local catalog is available.',
  },
  onlineFoodError: {
    ru: 'Онлайн-база недоступна. Можно пользоваться локальным каталогом и ручным вводом.',
    kk: 'Онлайн база қолжетімсіз. Жергілікті каталог пен қолмен енгізу бар.',
    en: 'Online search is unavailable. Use the local catalog or enter label values.',
  },
  onlineFoodQuery: {
    ru: 'Введи название от 2 до 80 символов.',
    kk: '2–80 таңбалық атау енгізіңіз.',
    en: 'Enter a product name of 2–80 characters.',
  },
  onlineFoodUsda: {
    ru: 'USDA: демонстрационный доступ, 30 запросов/час и 50/день на IP.',
    kk: 'USDA: демо қолжетімділік, IP үшін сағатына 30, күніне 50 сұрау.',
    en: 'USDA demo access: 30 requests/hour and 50/day per IP.',
  },
  onlineFoodResult: {
    ru: 'Результаты интернет-поиска',
    kk: 'Интернеттен іздеу нәтижелері',
    en: 'Online search results',
  },
};
