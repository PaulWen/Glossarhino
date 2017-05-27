import { SingleEntryInterface } from "./single-entry";
import { Entry } from "../../providers/model/entry-model";

// This is a dummy class for testing purposes. Will implement the SingleEntryInterface.
export class DummySingleEntry implements SingleEntryInterface {
    
    private entry: Entry = new Entry("Eintrag 1", 1, "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.")

    public getEntry(id: number) {
        return
    }
}