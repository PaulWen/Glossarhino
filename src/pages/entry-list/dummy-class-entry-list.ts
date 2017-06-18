import {Promise} from "es6-promise";
import {EntryListInterface} from "./entry-list-interface";

/**
 * Dummy Class to fake the behaviour of the model in order to have some presentation. Will be replaced by the model implementation
 */
export class DummyEntryList implements EntryListInterface {

  public isAuthenticated(): Promise<boolean> | boolean {
    return true;
  };

  public getEntryList(searchString: String, language: String, departmentId?: number): Array<String> {
    if (searchString == "") {
      return ["A-Muster", "B10-Lebensdauer", "C-Muster", "Dauerfestigkeit", "Digital Mockup Unit (DMU)", "Erstmusterprüfbericht (EMPB)", "Lieferantenentwicklungskosten (LEK)", "Entwicklungs- und Fertigungstiefe (EFTI)", "Quality Gate(QG)", "Qualitätsplan (Q-Plan)", "P-Freigabe", "Production Part Approval Process (PPAP)", "Rafferprobung"];
    } else {
      return [];
    }
  };

  public getLanguage() {
    return "English";
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
  };
}
