import { ILike } from 'typeorm';

// export const fuzzyquery = (obj: T) => {
export function fuzzyquery<T>(obj: T) {
  const data = { delFlag: 1 };
  Object.keys(obj).forEach((item) => {
    if (typeof obj[item] == 'number') {
      data[item] = obj[item];
    } else if (obj[item]) {
      data[item] = ILike(`%${obj[item]}%`);
    }
  });
  return data;
}
