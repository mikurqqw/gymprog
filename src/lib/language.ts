export const languages=['ru','kk','en'] as const;
export type Language=typeof languages[number];
export function detectLanguage(preferred:readonly string[]):Language{for(const locale of preferred){const prefix=locale.toLowerCase().split('-')[0];if(languages.includes(prefix as Language))return prefix as Language;}return 'ru';}
