import { type LocaleName, type Translation, findDeep, locales } from './i18n';

export class TranslationService {
  public static locale: LocaleName = 'en';

  public static t(
    langPath: Translation,
    options?: { [key: string]: string },
    clientLocale = this.locale,
  ) {
    const messages = locales[clientLocale];
    const text = findDeep(messages, langPath);

    if (!options || !text) {
      return text ?? langPath;
    }

    let textReplace = text;

    Object.keys(options).forEach((x) => {
      textReplace = textReplace.replace(
        new RegExp(`{${x}}`, 'g'),
        () => options[x] as string,
      );
    });

    return textReplace;
  }
}
