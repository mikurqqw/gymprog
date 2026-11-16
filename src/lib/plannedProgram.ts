import { generate as protectedGenerate } from './program';
export function generate(...args: Parameters<typeof protectedGenerate>) {
  const [profile] = args;
  return protectedGenerate(...args).map((row) =>
    row.lift && profile.strengthAssessment[row.lift] === 'unknown'
      ? {
          ...row,
          weight: null,
          percent: null,
          loadUnassessed: true,
          tip: {
            ru: '1ПМ не оценён. Освой движение без дополнительного веса или с самым лёгким доступным снарядом. Не проверяй максимум; остановись при боли.',
            kk: '1ҚМ бағаланбаған. Қимылды қосымша салмақсыз немесе ең жеңіл қолжетімді құралмен үйреніңіз. Максимумды сынамаңыз; ауырса тоқтаңыз.',
            en: '1RM is unassessed. Rehearse without added load or with the lightest available implement. Do not test a maximum; stop if pain occurs.',
          },
        }
      : row,
  );
}
