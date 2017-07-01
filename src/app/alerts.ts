import { AppModelService } from "../providers/app-model-service";
import { GlobalDepartmentConfigDataObject } from "../providers/dataobjects/global-department-config.dataobject";
import { UserDepartmentFilterConfigDataObject } from "../providers/dataobjects/user-department-filter-config.dataobject";
import { DepartmentDataObject } from "../providers/dataobjects/department.dataobject";
import { AlertController } from "ionic-angular";
import { Logger } from "./logger";

/**
 * This class implements all the alerts needed for the app
 */
export class Alerts {

    ////////////////////////////////////////////Properties////////////////////////////////////////////

    /////////////////////////////////////////////Methods///////////////////////////////////////////////

    //////////////////////////////////////////
    //       Department Filter Alert        //
    //////////////////////////////////////////

    private static async loadMergedDepartmentConfig(appModelService: AppModelService): Promise<Array<{ details: DepartmentDataObject, checked: boolean }>> {
        let globalDepartmentConfig: GlobalDepartmentConfigDataObject = appModelService.getGlobalDepartmentConfigDataObject();

        //load user department filter preferences
        let userDepartmentFilterConfig: UserDepartmentFilterConfigDataObject = await appModelService.getUserDepartmentFilterConfigDataObject()

        // merge global with user config
        let mergedDepartmentConfig: Array<{ details: DepartmentDataObject, checked: boolean }> = this.mergeGlobalDepartmentConfigWithUserPreferences(globalDepartmentConfig, userDepartmentFilterConfig);

        return mergedDepartmentConfig;

    }

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

            let departmentFilterAlert = alertCtrl.create();
            departmentFilterAlert.setTitle("Select departments");

            // load data to create inputs for all departments
            this.loadMergedDepartmentConfig(appModelService).then((data) => {
                let mergedDepartmentConfig = data;

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
                        resolve(appModelService.setUserDepartmentFilterConfigDataObject(data));
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
