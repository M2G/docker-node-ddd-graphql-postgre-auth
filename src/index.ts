import 'module-alias/register';
import container from './container';
import './scheduler-worker/main';

export const app: any = container.resolve('app');
app.start().catch((error: any) => {
  app.logger.error(error.stack);
  process.exit();
});
