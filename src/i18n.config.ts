import i18n from 'i18n';
import path from 'path';

i18n.configure({
  autoReload: true,
  defaultLocale: 'en',
  // directory: path.join(__dirname, 'lang'),
  header: 'accept-language',
  locales: ['en', 'fr'],
  logDebugFn(msg): void {
    console.log('debug', msg);
  },
  // setting of log level ERROR - default to require('debug')('i18n:error')
  logErrorFn(msg): void {
    console.log('error', msg);
  },
  logWarnFn(msg): void {
    console.log('warn', msg);
  },
  queryParameter: 'lang',
  staticCatalog: {
    en: import('./en.json'),
    fr: import('./fr.json'),
  },
});

i18n.setLocale('en');

// console.log(':::::::::::::::::::', i18n.__('test'));

export default i18n;
