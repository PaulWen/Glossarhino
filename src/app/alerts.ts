import {AlertController} from "ionic-angular";
import {AppModelService} from "../providers/app-model-service";
import {DepartmentDataObject} from "../providers/dataobjects/department.dataobject";
import {GlobalDepartmentConfigDataObject} from "../providers/dataobjects/global-department-config.dataobject";
import {UserDepartmentFilterConfigDataObject} from "../providers/dataobjects/user-department-filter-config.dataobject";
import {Logger} from "./logger";

/**
 * This class implements all the alerts needed for the app
 */
export class Alerts {

  ////////////////////////////////////////////Properties////////////////////////////////////////////

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //       Department Filter Alert        //
  //////////////////////////////////////////

  private static mergeGlobalDepartmentConfigWithUserPreferences(globalDepartmentConfig: GlobalDepartmentConfigDataObject, userDepartmentFilterConfig: UserDepartmentFilterConfigDataObject): Array<{ details: DepartmentDataObject, checked: boolean }> {
    let mergedDepartmentConfig: Array<{ details: DepartmentDataObject, checked: boolean }> = [];

    globalDepartmentConfig.departments.forEach(department => {
      if (userDepartmentFilterConfig.selectedDepartments.find(selectedDepartment => selectedDepartment == department.departmentId) == undefined) {
        mergedDepartmentConfig.push({
          details: department,
          checked: false
        });
      } else {
        mergedDepartmentConfig.push({
          details: department,
          checked: true
        });
      }
    });
    return mergedDepartmentConfig;
  }

  public static showDepartmentFilterAlert(alertCtrl: AlertController, appModelService: AppModelService): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // load data to create inputs for all departments
      let globalDepartmentConfig: GlobalDepartmentConfigDataObject = appModelService.getGlobalDepartmentConfigDataObject();
      appModelService.getUserDepartmentFilterConfigDataObject().then((userDepartmentFilterConfig: UserDepartmentFilterConfigDataObject) => {
        let mergedDepartmentConfig: Array<{ details: DepartmentDataObject, checked: boolean }> = this.mergeGlobalDepartmentConfigWithUserPreferences(globalDepartmentConfig, userDepartmentFilterConfig);

        // create dialog
        let departmentFilterAlert = alertCtrl.create();
        departmentFilterAlert.setTitle("Select departments");


        // create inputs for the departments
        mergedDepartmentConfig.forEach(department => {
          departmentFilterAlert.addInput({
            type: "checkbox",
            label: department.details.departmentName,
            value: department.details.departmentId.toString(),
            checked: department.checked
          });
        });

        // add cancel button
        departmentFilterAlert.addButton("Cancel");

        // add okay button
        departmentFilterAlert.addButton({
          text: "OK",
          handler: data => {
            // update user settings
            userDepartmentFilterConfig.selectedDepartments = data;
            appModelService.setUserDepartmentFilterConfigDataObject(userDepartmentFilterConfig).then((data) => {
              resolve(data);
            });
          }
        });

        // show alert
        departmentFilterAlert.present();

      }, (error) => {
        Logger.log("Loading mergedDepartmentConfig failed (Class: Alerts, Method: showDepartmentFilterAlert()");
        Logger.error(error);
        reject(error);
      });
    });
  }
}
