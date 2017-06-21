export abstract class LanguageFilterDataobject {

  abstract get languageId(): number;

  abstract get filtered(): boolean;
  abstract set filtered(filtered: boolean);

  public static init(languageId: number, filtered:boolean): LanguageFilterDataobject {
    return {
      "languageId": languageId,
      "filtered": filtered
    }
  }

}
