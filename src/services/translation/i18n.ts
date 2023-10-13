import * as en from '../../../client/locales/en.json';

export const locales = {
  en,
};

type LocaleMap = typeof locales;

export type LocaleName = keyof LocaleMap;

export type Locale = LocaleMap[LocaleName];

type PathInto<T extends Record<string, unknown>> = keyof {
  [K in keyof T as T[K] extends string
    ? K
    : T[K] extends Record<string, unknown>
    ? `${K & string}.${PathInto<T[K]> & string}`
    : never]: unknown;
};

export type Translation = PathInto<Locale>;

export const findDeep = (
  obj: Record<string, unknown>,
  path: string,
): string | undefined => {
  const paths = path.split('.');
  let current: Record<string, unknown> | string = obj;
  for (let i = 0; i < paths.length; i += 1) {
    const pathAtI = paths[i];

    if (!pathAtI) return undefined;

    if (typeof pathAtI === 'string') return pathAtI;

    if (current[pathAtI] === undefined) {
      return undefined;
    }
    current = current[pathAtI];
  }

  return current as string;
};
