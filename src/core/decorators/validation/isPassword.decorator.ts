import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { passwordRegex } from '@/utility/regex';

@ValidatorConstraint({ async: false })
export class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: unknown) {
    if (typeof password !== 'string') return false;
    return passwordRegex.test(password);
  }
}

export const IsPassword = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must contain at least one uppercase letter, one lowercase letter, one special character, and one digit`,
        ...validationOptions,
      },
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
};
