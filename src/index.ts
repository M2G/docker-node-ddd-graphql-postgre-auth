import 'module-alias/register';
import container from './container';
import './scheduler-worker/main';

/*
import LocaleService from 'services/localeService';
import i18n from './i18n.config';

const localeService = new LocaleService(i18n);
console.log(localeService.getLocales()); // ['en', 'el']
console.log(localeService.getCurrentLocale()); // 'en'
console.log(localeService.translate('Hello')); //  'Hello'
console.log(localeService.translatePlurals('You have %s message', 3));
 */
export const app: any = container.resolve('app');
app.start().catch((error: any) => {
  app.logger.error(error.stack);
  process.exit();
});
