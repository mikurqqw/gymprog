export const loadGoalStrings = {
  title: {
    ru: 'Цели по весу в упражнениях',
    kk: 'Жаттығудағы салмақ мақсаттары',
    en: 'Exercise weight goals',
  },
  description: {
    ru: 'Укажи желаемый вес. Покажем первое занятие, где он есть в текущем плане.',
    kk: 'Қалаған салмақты көрсетіңіз. Ағымдағы жоспарда сол салмақ алғаш кездесетін жаттығуды көрсетеміз.',
    en: 'Enter a target load to see the first session that calls for it in your current plan.',
  },
  help: {
    ru: 'Дата берётся из расписания и может измениться при переносе занятия или смене программы. Фактический результат зависит от тренировок.',
    kk: 'Күн кестеден алынады және жаттығу ауыстырылса немесе бағдарлама өзгерсе, жаңарады. Нақты нәтиже жаттығуларға байланысты.',
    en: 'The date comes from your schedule and updates when you move a session or switch plans. Actual progress depends on your training.',
  },
  movement: {
    ru: 'Упражнение или тренажёр',
    kk: 'Жаттығу немесе тренажер',
    en: 'Exercise or machine',
  },
  custom: {
    ru: 'Своё упражнение или тренажёр',
    kk: 'Өз жаттығуыңыз немесе тренажеріңіз',
    en: 'Custom exercise or machine',
  },
  customName: {
    ru: 'Название упражнения или тренажёра',
    kk: 'Жаттығу немесе тренажер атауы',
    en: 'Exercise or machine name',
  },
  strictCurl: {
    ru: 'Строгий подъём на бицепс',
    kk: 'Бицепске қатаң көтеру',
    en: 'Strict biceps curl',
  },
  extremeCurl: {
    ru: 'Экстремальный подъём на бицепс',
    kk: 'Бицепске экстремалды көтеру',
    en: 'Extreme biceps curl',
  },
  target: { ru: 'Желаемый вес', kk: 'Қалаған салмақ', en: 'Target weight' },
  save: { ru: 'Сохранить цель', kk: 'Мақсатты сақтау', en: 'Save goal' },
  edit: { ru: 'Изменить цель', kk: 'Мақсатты өңдеу', en: 'Edit goal' },
  limit: {
    ru: 'Можно сохранить до 40 целей.',
    kk: '40 мақсатқа дейін сақтауға болады.',
    en: 'You can save up to 40 goals.',
  },
  recorded: {
    ru: 'Уже записано в дневнике',
    kk: 'Күнделікке жазылған',
    en: 'Already recorded in your log',
  },
  scheduled: { ru: 'По плану', kk: 'Жоспар бойынша', en: 'Scheduled' },
  repUnit: { ru: 'повт.', kk: 'рет', en: 'reps' },
  above: {
    ru: 'Цель выше расчётных весов в плане. На оставшихся занятиях максимум',
    kk: 'Қалған жаттығулардағы ең үлкен салмақ',
    en: 'Highest load in the remaining sessions',
  },
  manual: {
    ru: 'Для этого упражнения в плане пока нет расчётного веса.',
    kk: 'Бұл жаттығу үшін жоспарда әзірге есептелген салмақ жоқ.',
    en: 'The plan currently has no calculated load for this exercise.',
  },
  absent: {
    ru: 'Этого варианта нет в текущем плане.',
    kk: 'Бұл нұсқа ағымдағы жоспарда жоқ.',
    en: 'This variation is outside your current plan.',
  },
  ended: {
    ru: 'В расписании больше нет занятий с этим упражнением.',
    kk: 'Кестеде бұл жаттығумен сабақ қалған жоқ.',
    en: 'There are no upcoming sessions for this exercise.',
  },
  paused: {
    ru: 'Расчёт даты приостановлен из-за ограничений по здоровью.',
    kk: 'Денсаулық шектеулеріне байланысты күнді есептеу тоқтатылды.',
    en: 'The date estimate is paused due to health restrictions.',
  },
} as const;
