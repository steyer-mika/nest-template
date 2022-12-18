import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { timeRegex } from 'src/utility/regex';

@ValidatorConstraint({ async: false })
export class IsTimeConstraint implements ValidatorConstraintInterface {
  validate(time: unknown) {
    if (typeof time !== 'string') return false;
    return timeRegex.test(time);
  }
}

export const IsTime = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be a valid time. Format: HH:MM.`,
        ...validationOptions,
      },
      constraints: [],
      validator: IsTimeConstraint,
    });
  };
};
