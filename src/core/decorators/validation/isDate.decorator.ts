import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { dateRegex } from '@/utility/regex';

@ValidatorConstraint({ async: false })
export class IsDateConstraint implements ValidatorConstraintInterface {
  validate(date: unknown) {
    if (typeof date !== 'string') return false;
    return dateRegex.test(date);
  }
}

export const IsDate = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be a valid date. Format: YYYY-MM-DD.`,
        ...validationOptions,
      },
      constraints: [],
      validator: IsDateConstraint,
    });
  };
};
