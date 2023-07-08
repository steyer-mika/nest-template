import {
  registerDecorator,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsStringOrNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(value: unknown) {
    const type = typeof value;
    return type === 'string' || type === 'number';
  }
}

export const IsStringOrNumber = (validationOptions?: ValidationOptions) => {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: {
        message: `${propertyName} must be a string or number.`,
        ...validationOptions,
      },
      constraints: [],
      validator: IsStringOrNumberConstraint,
    });
  };
};
