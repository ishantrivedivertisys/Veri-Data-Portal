import { Transform } from 'class-transformer';

export const TransformDateToEpoch = (): PropertyDecorator => {
  return Transform(
    ({ obj, key }) => {
      if (obj[key]) {
        if (obj[key] instanceof Date) {
          return parseInt((obj[key].getTime() / 1000).toString(), 10);
        }
        return obj[key];
      }
      return undefined;
    },
    { toClassOnly: true },
  );
};
