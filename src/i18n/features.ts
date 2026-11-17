import { landingStrings } from './landingStrings';
import { noticeStrings } from './noticeStrings';
import { onboardingStrings } from './onboardingStrings';
import { focusStrings } from './focusStrings';
import { navigationStrings } from './navigationStrings';
import { launchStrings } from './launchStrings';
import { storefrontStrings } from './storefrontStrings';
import { sessionStrings } from './sessionStrings';
import { uxStrings } from './uxStrings';
import { securityStrings } from './securityStrings';
import { programStrings } from './programStrings';
import { dataStrings } from './dataStrings';
import { privacyStrings } from './privacyStrings';
import { injuryStrings } from './injuryStrings';
export const featureStrings: Record<string, { ru: string; kk: string; en: string }> = {
  ...navigationStrings,
  ...focusStrings,
  ...onboardingStrings,
  ...noticeStrings,
  ...landingStrings,
  ...launchStrings,
  ...injuryStrings,
  ...privacyStrings,
  ...dataStrings,
  ...programStrings,
  ...securityStrings,
  ...uxStrings,
  ...storefrontStrings,
  ...sessionStrings,
  calorieEstimate: {
    ru: 'Это приблизительные расчёты, а не рекомендации врача или диетолога. Они не учитывают индивидуальный обмен веществ, гормоны, лекарства, состав тела и ошибки учёта. Реальные потребности могут отличаться на 10–20% и более.',
    kk: 'Бұл — дәрігер не диетолог кеңесі емес, шамамен есептеу. Жеке зат алмасу, гормондар, дәрілер, дене құрамы және есеп қателері ескерілмейді. Нақты қажеттілік 10–20% немесе одан да көп өзгеше болуы мүмкін.',
    en: 'These figures are estimates, not medical or dietitian advice. Individual metabolism, hormones, medications, body composition and tracking errors are not accounted for. Real needs can differ by 10–20% or more.',
  },
  medicalDietBlocked: {
    ru: 'Автоматические рекомендации по питанию отключены. Обсуди питание с врачом или диетологом; дневник можно вести без целевых значений.',
    kk: 'Автоматты тамақтану кеңестері өшірілді. Тамақтануды дәрігермен не диетологпен талқылаңыз; күнделікті мақсатсыз жүргізуге болады.',
    en: 'Automatic dietary advice is disabled. Discuss nutrition with a clinician or dietitian; you can still log food without targets.',
  },
  underweightNotice: {
    ru: 'ИМТ ниже 18,5: дефицит и снижение веса недоступны. ИМТ — ориентир, не диагноз.',
    kk: 'ДСИ 18,5-тен төмен: тапшылық пен салмақ азайту қолжетімсіз. ДСИ — бағдар, диагноз емес.',
    en: 'BMI below 18.5: deficit and weight-loss options are unavailable. BMI is a screening indicator, not a diagnosis.',
  },
  activitySeparate: {
    ru: 'Повседневная активность — отдельно от количества тренировок. Подсказки по шагам приблизительные, коэффициент не измеряет твой обмен веществ.',
    kk: 'Күнделікті белсенділік жаттығу санынан бөлек. Қадам саны шамамен берілген; коэффициент зат алмасуды өлшемейді.',
    en: 'Daily activity is separate from planned workouts. Step hints are approximate; the multiplier does not measure your metabolism.',
  },
  sedentary: { ru: 'Сидячий образ жизни', kk: 'Отырықшы өмір салты', en: 'Sedentary' },
  lightActivity: { ru: 'Лёгкая активность', kk: 'Жеңіл белсенділік', en: 'Light activity' },
  moderateActivity: {
    ru: 'Умеренная активность',
    kk: 'Орташа белсенділік',
    en: 'Moderate activity',
  },
  highActivity: { ru: 'Высокая активность', kk: 'Жоғары белсенділік', en: 'High activity' },
  veryHighActivity: {
    ru: 'Очень высокая активность',
    kk: 'Өте жоғары белсенділік',
    en: 'Very high activity',
  },
  sedentaryHint: {
    ru: 'Работа сидя, мало ходьбы.',
    kk: 'Отырып жұмыс істеу, аз жүру.',
    en: 'Desk-based day with little walking.',
  },
  lightActivityHint: {
    ru: 'Периодическая ходьба и бытовая активность.',
    kk: 'Мезгіл-мезгіл жүру, үйдегі белсенділік.',
    en: 'Some walking and light daily activity.',
  },
  moderateActivityHint: {
    ru: 'Регулярная ходьба, часть дня на ногах.',
    kk: 'Тұрақты жүру, күннің бір бөлігі аяқта.',
    en: 'Regular walking and part of the day standing.',
  },
  highActivityHint: {
    ru: 'Много ходьбы или физически активная работа.',
    kk: 'Көп жүру немесе белсенді дене еңбегі.',
    en: 'Extensive walking or an active job.',
  },
  veryHighActivityHint: {
    ru: 'Тяжёлая физическая работа, длительная активность.',
    kk: 'Ауыр дене еңбегі, ұзақ белсенділік.',
    en: 'Heavy physical work and prolonged daily activity.',
  },
  calculationDetails: {
    ru: 'Как рассчитано',
    kk: 'Қалай есептелді',
    en: 'How this was calculated',
  },
  calibration: {
    ru: 'Калибровка по дневнику, ориентировочно',
    kk: 'Күнделік бойынша шамамен түзету',
    en: 'Estimated calibration from your log',
  },
  algorithmLabel: {
    ru: 'Алгоритмический расчёт · материалы созданы с помощью ИИ',
    kk: 'Алгоритмдік есеп · материалдар ЖИ көмегімен жасалған',
    en: 'Algorithmic calculation · AI-assisted content',
  },
  healthScreen: {
    ru: 'Предварительный опрос о здоровье',
    kk: 'Денсаулық туралы бастапқы сауалнама',
    en: 'Pre-participation health screen',
  },
  consultFirst: {
    ru: 'Сначала обсуди занятия с врачом. До этого — консервативная нагрузка и без тестов максимума.',
    kk: 'Алдымен жаттығуды дәрігермен талқылаңыз. Оған дейін — сақ жүктеме, максимумды тексермеңіз.',
    en: 'Discuss exercise with a clinician first. Until then, use conservative settings and avoid max testing.',
  },
  heart: { ru: 'Заболевание сердца', kk: 'Жүрек ауруы', en: 'Heart condition' },
  bloodPressure: {
    ru: 'Проблемы с артериальным давлением',
    kk: 'Қан қысымына қатысты мәселе',
    en: 'Blood-pressure concern',
  },
  chestPain: { ru: 'Боль в груди', kk: 'Кеуде ауыруы', en: 'Chest pain' },
  boneJoint: {
    ru: 'Проблемы с костями или суставами',
    kk: 'Сүйек не буын мәселесі',
    en: 'Bone or joint problem',
  },
  recentSurgery: { ru: 'Недавняя операция', kk: 'Жуырдағы операция', en: 'Recent surgery' },
  pregnancy: {
    ru: 'Беременность или грудное вскармливание',
    kk: 'Жүктілік не емізу',
    en: 'Pregnancy or breastfeeding',
  },
  diabetes: { ru: 'Диабет', kk: 'Диабет', en: 'Diabetes' },
  kidneyDisease: { ru: 'Заболевание почек', kk: 'Бүйрек ауруы', en: 'Kidney disease' },
  medications: {
    ru: 'Приём лекарств, влияющих на нагрузку или питание',
    kk: 'Жүктемеге не тамақтануға әсер ететін дәрі қабылдау',
    en: 'Medication affecting exercise or nutrition',
  },
  doctorRestrictions: {
    ru: 'Ограничения от врача',
    kk: 'Дәрігер белгілеген шектеулер',
    en: 'Doctor-imposed restrictions',
  },
  medicalContext: {
    ru: 'Общая фитнес-информация, не медицинская помощь. Острая боль, боль в груди, обморочное состояние, выраженная слабость или неврологические симптомы — прекрати нагрузку и обратись за медицинской помощью.',
    kk: 'Бұл жалпы фитнес ақпараты, медициналық көмек емес. Қатты ауырсыну, кеуде ауыруы, естен тану сезімі, айқын әлсіздік не неврологиялық белгі болса — жүктемені тоқтатып, медициналық көмекке жүгініңіз.',
    en: 'General fitness information, not medical care. Stop exercise and seek medical help for sharp pain, chest pain, feeling faint, severe weakness or neurological symptoms.',
  },
};
