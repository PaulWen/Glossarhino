import {Promise} from "es6-promise";
import {AppConfig} from "../../app/app-config";
import {AttachmentDataobject} from "../../providers/dataobjects/attachment.dataobject";
import {DepartmentEntryDescriptionDataobject} from "../../providers/dataobjects/department-entry-description.dataobject";
import {EntryDataobject} from "../../providers/dataobjects/entry.dataobject";
import {SingleEntryInterface} from "./single-entry-interface";

/**
 * This is a dummy class for testing purposes. Will implement the SingleEntryInterface.
 */
export class DummySingleEntry implements SingleEntryInterface {

  public isAuthenticated(): Promise<boolean> | boolean {
    return true;
  }

  public getEntry(name: String): EntryDataobject {
    return new EntryDataobject("B10-Lebensdauer", 0, [
      new DepartmentEntryDescriptionDataobject(0, "Bezeichnet die Lebensdauer im Rahmen des Zuverlässigkeitsmana- gements; Der B10-Wert ist jene Zeit, bei der unter gegebenen Bedin- gungen 10% aller Produkte/Komponenten etc. ausgefallen sind, das heißt, eine Zuverlässigkeit von 90% besteht.", [new AttachmentDataobject("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new AttachmentDataobject("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de"),
      new DepartmentEntryDescriptionDataobject(1, AppConfig.LOREM_IPSUM, [new AttachmentDataobject("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new AttachmentDataobject("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de"),
      new DepartmentEntryDescriptionDataobject(2, AppConfig.LOREM_IPSUM, [new AttachmentDataobject("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new AttachmentDataobject("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de"),
      new DepartmentEntryDescriptionDataobject(3, AppConfig.LOREM_IPSUM, [new AttachmentDataobject("Test Image", new URL("https://c1.staticflickr.com/6/5337/8940995208_5da979c52f.jpg")), new AttachmentDataobject("DHBW Broschüre", new URL("http://www.dhbw.de/fileadmin/user_upload/Dokumente/Hochschulkommunikation/DHBW_Imagebroschuere_web.pdf"))], "Max Mustermann", "max.mustermann@dhbw-stuttgart.de")]);
  }

  public getFilter(): Array<boolean> {
    let filter: Array<boolean> = [];
    filter[0] = true;
    filter[1] = true;
    filter[2] = false;
    filter[3] = true;

    return filter;
  };

  public resolveDepartmentId(departmentId: number): String {
    switch (departmentId) {
      case 0: {
        //statements;
        return "Description";
      }
      case 1: {
        //statements;
        return "Management";
      }
      case 2: {
        //statements;
        return "Marketing";
      }
      case 3: {
        //statements;
        return "Production";
      }
      default: {
        //statements;
        return "No department found with id: " + departmentId;
      }
    }
    ;
  };
}
