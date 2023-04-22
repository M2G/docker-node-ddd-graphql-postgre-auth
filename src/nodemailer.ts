/*eslint-disable*/
import * as nodemailer from 'nodemailer';
import type { Options } from 'nodemailer-mailgun-transport';
import mg from 'nodemailer-mailgun-transport';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const emailTemplateSource = fs.readFileSync(
  path.join(__dirname, 'templates/forgot-password-email.hbs'),
  'utf8',
);
const auth: Options = {
  auth: {
    api_key: process.env.MAILER_GUN_AUTH_API_KEY || 'test',
    domain: process.env.MAILER_GUN_AUTH_DOMAIN || 'test',
  },
};

const smtpTransport: any = (nodemailer as any).createTransport(mg(auth));
const template = handlebars.compile(emailTemplateSource);

export { template, smtpTransport };

