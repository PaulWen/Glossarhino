export abstract class EntryListPageEntryDataObject {

    abstract get _id(): string;

    abstract get name(): string;

    abstract get synonyms(): Array<string>;

    abstract get acronyms(): Array<string>;

}