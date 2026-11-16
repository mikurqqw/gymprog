export const onboardingStrings: Record<string, { ru: string; kk: string; en: string }> = {
  setupStrengthMethod: { ru: 'Способ оценки', kk: 'Бағалау тәсілі', en: 'Assessment method' },
  setupGoal: { ru: 'Выбери направление', kk: 'Бағытты таңдаңыз', en: 'Choose your direction' },
  setupKnown: { ru: 'Знаю свой 1ПМ', kk: '1ҚМ көрсеткішін білемін', en: 'I know my 1RM' },
  setupEstimate: {
    ru: 'Оценить по недавнему подходу',
    kk: 'Жуырдағы сетпен бағалау',
    en: 'Estimate from a recent set',
  },
  setupUnknown: {
    ru: 'Не знаю — начну спокойно',
    kk: 'Білмеймін — жеңіл бастаймын',
    en: 'I don’t know — start conservatively',
  },
  setupManual: {
    ru: 'Максимум не оценён. Начни с освоения движения без добавленного веса или с самым лёгким доступным снарядом. Вес выбирается вручную; максимум проверять не нужно.',
    kk: 'Максимум бағаланбаған. Қимылды қосымша салмақсыз не ең жеңіл қолжетімді құралмен үйренуден бастаңыз. Салмақ қолмен таңдалады; максимумды сынау қажет емес.',
    en: 'Maximum strength is unassessed. Start by learning the movement without added load or with the lightest available implement. Choose loads manually; no maximum test is needed.',
  },
  setupEstimated: {
    ru: 'Расчётная оценка, не проверенный максимум',
    kk: 'Есептік баға, тексерілген максимум емес',
    en: 'Calculated estimate, not a tested maximum',
  },
  setupRecentWeight: {
    ru: 'Вес недавнего подхода (kg)',
    kk: 'Жуырдағы сет салмағы (kg)',
    en: 'Recent set weight (kg)',
  },
  setupRecentReps: {
    ru: 'Повторы в подходе (1–10)',
    kk: 'Сеттегі қайталаулар (1–10)',
    en: 'Set repetitions (1–10)',
  },
  setupRecentRpe: {
    ru: 'Усилие того подхода, RPE',
    kk: 'Сол сеттегі күш салу, RPE',
    en: 'Effort for that set, RPE',
  },
  setupSummary: { ru: 'Твой старт', kk: 'Сіздің бастауыңыз', en: 'Your starting plan' },
  setupLimitations: {
    ru: 'Травмы и ограничения: добавь только то, что относится к тебе.',
    kk: 'Жарақаттар мен шектеулер: тек өзіңізге қатыстысын қосыңыз.',
    en: 'Injuries and limitations: add only what applies to you.',
  },
  setupFast: {
    ru: 'Три шага. Данные можно изменить позже; черновик сохраняется на устройстве.',
    kk: 'Үш қадам. Деректерді кейін өзгертуге болады; жоба құрылғыда сақталады.',
    en: 'Three steps. Edit your details later; the draft saves on this device.',
  },
  setupUnknownNotice: {
    ru: 'Сила ещё не оценена. Автоматические веса, прогноз силы и тест максимума отключены до заполнения 1ПМ. Журнал тренировок доступен.',
    kk: 'Күш әлі бағаланбаған. 1ҚМ толтырылғанша автоматты салмақтар, күш болжамы және максимум сынағы өшірілген. Жаттығу күнделігі қолжетімді.',
    en: 'Strength is unassessed. Automatic loads, strength forecasts and maximum tests remain disabled until you enter a 1RM. Workout logging is available.',
  },
  gateStepAge: { ru: 'Возраст', kk: 'Жас', en: 'Age' },
  gateStepConsent: { ru: 'Согласия', kk: 'Келісімдер', en: 'Consents' },
  gateStepHealth: { ru: 'Здоровье', kk: 'Денсаулық', en: 'Health' },
  gateSummary: {
    ru: 'Перед стартом: возраст, отдельные согласия и вопросы о здоровье. Дата рождения не сохраняется.',
    kk: 'Бастау алдында: жас, жеке келісімдер және денсаулық сұрақтары. Туған күн сақталмайды.',
    en: 'Before starting: age, separate consents and health questions. Your date of birth is not saved.',
  },
};

export const onboardingTranslationReview = {
  kkNativeSpeaker: false,
  machineAssisted: true,
} as const;
