import { Transform } from 'class-transformer';

export const TransformToBoolean = (propertyKey?: string): PropertyDecorator => {
  return Transform(
    ({ obj, key }) => {
      const value = obj[propertyKey ?? key];
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') {
          return true;
        }
        if (value.toLowerCase() === 'false') {
          return false;
        }
      }
      return value;
    },
    { toClassOnly: true },
  );
};
