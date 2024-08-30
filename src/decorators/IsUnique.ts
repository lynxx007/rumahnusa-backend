import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueConstraint } from '../rules/isUniqueConstraint';

// decorator options interface
export type IsUniqeInterface = {
  tableName: string;
  column: string;
};

// decorator function
export function IsUnique(options: IsUniqeInterface, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueConstraint,
    });
  };
}
