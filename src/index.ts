import 'module-alias/register';
import container from './container';
import './scheduler-worker/main';

export const app = container.resolve('app');
app.start().catch(function (error): void {
  app.logger.error(error.stack);
  process.exit();
});
