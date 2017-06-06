import { SingleEntryInterface } from "./single-entry-interface";
import { Entry } from "../../providers/model/entry-model";
import { AppConfig } from "../../app/app-config";
import { Department } from "../../providers/model/department-model";
import { Attachment } from "../../providers/model/attachment-model";

/**
 * This is a dummy class for testing purposes. Will implement the SingleEntryInterface.
 */ 
export class DummySingleEntry implements SingleEntryInterface {

    public getEntry(name: String): Entry {
        return new Entry("Lorem Ipsum Entry", [new Department(0, AppConfig.LOREM_IPSUM, [new Attachment("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new Attachment("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de")])
    }
}