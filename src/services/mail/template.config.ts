import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';

const compileTemplate = <T>(path: string) => {
  const templateString = readFileSync(__dirname + path, {
    encoding: 'utf-8',
  });

  return Handlebars.compile<T>(templateString);
};

interface ConfirmationTemplate {
  name: string;
  url: string;
}

interface ResetPasswordTemplate {
  name: string;
  url: string;
}

export const templateConfig = {
  confirmation: compileTemplate<ConfirmationTemplate>(
    '/templates/confirmation.hbs',
  ),
  ['reset-password']: compileTemplate<ResetPasswordTemplate>(
    '/templates/reset-password.hbs',
  ),
} as const;
