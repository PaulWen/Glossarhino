export abstract class LanguageFilterDataobject {

  abstract get languageId(): number;

  abstract get filtered(): boolean;
  abstract set filtered(filtered: boolean);

}
