export abstract class EntryListPageEntryDataObject {

  abstract get _id(): string;

  abstract get name(): string;

  abstract get synonyms(): Array<string>;

  abstract get acronyms(): Array<string>;


  public static compare(entryListPageEntryDataObject1: EntryListPageEntryDataObject, entryListPageEntryDataObject2: EntryListPageEntryDataObject): number {
    if (entryListPageEntryDataObject1.name < entryListPageEntryDataObject2.name)
      return -1;
    if (entryListPageEntryDataObject1.name > entryListPageEntryDataObject2.name)
      return 1;
    return 0;
  }

}
