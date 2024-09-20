import 'module-alias/register';
import './scheduler-worker/main';
import container from './container';

export const app = container.resolve('app');
app.start().catch(function (error): void {
  app.logger.error(error.stack);
  process.exit();
});
