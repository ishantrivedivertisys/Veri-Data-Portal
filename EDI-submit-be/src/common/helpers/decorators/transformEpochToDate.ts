import { Transform } from 'class-transformer';

export const TransformEpochToDate = (): PropertyDecorator => {
  return Transform(
    ({ obj, key }) => {
      if (obj[key]) {
        const d = new Date(0);
        d.setUTCSeconds(obj[key]);
        return d;
      }
      return undefined;
    },
    { toClassOnly: true },
  );
};
