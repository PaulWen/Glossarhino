import { Component, ViewChild } from '@angular/core';
import { DepartmentFilterModelInterface } from "./department-filter.model-interface";
import { AppModelService } from "../../providers/app-model-service";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";
import { UserDepartmentFilterConfigDataObject } from "../../providers/dataobjects/user-department-filter-config.dataobject";
import { Logger } from "../../app/logger";
import { Select, Events } from "ionic-angular";

@Component({
  selector: 'department-filter',
  templateUrl: 'department-filter.html'
})
export class DepartmentFilterComponent {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private events: Events;

  // model object
  private appModelService: DepartmentFilterModelInterface;

  // data objects
  private globalDepartmentConfig: GlobalDepartmentConfigDataObject;
  private userDepartmentFilterConfig: UserDepartmentFilterConfigDataObject;

  // selector
  @ViewChild(Select) select: Select;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(events: Events, appModelService: AppModelService) {
    // instantiate ionic injected components
    this.events = events;

    // instantiate model object
    this.appModelService = appModelService;

  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //     Angular Lifecycle Functions      //
  //////////////////////////////////////////

  private ngOnInit() {
    this.loadData();
  }

  //////////////////////////////////////////
  //        Component Functions           //
  //////////////////////////////////////////

  private loadData() {
    this.globalDepartmentConfig = this.appModelService.getGlobalDepartmentConfigDataObject();

    this.appModelService.getUserDepartmentFilterConfigDataObject().then((data) => {
      this.userDepartmentFilterConfig = data;
    }, (error) => {
      Logger.log("Loading userDepartmentFilterConfig failed (Class: DepartmentFilterComponent, Method: loadData()");
      Logger.error(error);
    });
  }

  private setPreferences() {
    this.appModelService.setUserDepartmentFilterConfigDataObject(this.userDepartmentFilterConfig).then(() => {
      this.loadData();
    }, (error) => {
      Logger.log("Setting userDepartmentFilterConfig failed (Class: DepartmentFilterComponent, Method: setPreferences()");
      Logger.error(error);
    });
  }

  public showAlert(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.select.open();
      this.select.ionChange.subscribe(() => {
        resolve(true);
      });
    });
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

}
