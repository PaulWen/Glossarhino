import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { LinkedObjectsModalModelInterface } from "./linked-objects-modal.model-interface";
import { AppModelService } from "../../providers/app-model-service";
import { GlobalDepartmentConfigDataObject } from "../../providers/dataobjects/global-department-config.dataobject";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";

@IonicPage()
@Component({
  selector: 'page-linked-objects-modal',
  templateUrl: 'linked-objects-modal.html',
})
export class LinkedObjectsModalPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private viewCtrl: ViewController;
  private alertCtrl: AlertController;

  // navparams
  private relatedDepartments: Array<string>;
  private relatedEntries: Array<string>;
  private synonyms: Array<string>;
  private acronyms: Array<string>;
  private isEditMode: boolean;

  // model object
  private appModelService: LinkedObjectsModalModelInterface;

  // data objects
  private globalDepartmentConfigDataObject: GlobalDepartmentConfigDataObject;

  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, alertCtrl: AlertController, appModelService: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;
    this.alertCtrl = alertCtrl;

    // get navParams
    this.relatedDepartments = this.navParams.get("relatedDepartments");
    this.relatedEntries = this.navParams.get("relatedEntries");
    this.synonyms = this.navParams.get("synonyms");
    this.acronyms = this.navParams.get("acronyms");
    this.isEditMode = this.navParams.get("isEditMode") ? this.navParams.get("isEditMode") : false;

    // instantiate model
    this.appModelService = appModelService
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewDidLoad() {
    this.loadData();
  }

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.appModelService.isAuthenticated();
  }

  //////////////////////////////////////////
  //            Page Functions            //
  //////////////////////////////////////////

  private loadData() {
    this.globalDepartmentConfigDataObject = this.appModelService.getGlobalDepartmentConfigDataObject();
  }

  private addRelatedDepartment(relatedDepartmentId: string) {
    this.relatedDepartments.push(relatedDepartmentId);
    this.relatedDepartments.sort((a, b) => {
      if (a < b)
        return -1;
      if (a > b)
        return 1;
      return 0;
    });
  }

  private removeRelatedDepartment(departmentId: string) {
    let index: number = this.relatedDepartments.findIndex(relatedDepartmentId => relatedDepartmentId == departmentId);
    if (index > -1) {
      this.relatedDepartments.splice(index, 1);
    }
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeLinkedObjectsModal() {
    this.viewCtrl.dismiss({
      relatedDepartments: this.relatedDepartments
    });
  }

  private showRelatedDepartmentsCheckboxAlert() {
    let relatedDepartmentCheckboxAlert = this.alertCtrl.create();
    relatedDepartmentCheckboxAlert.setTitle("Select related departments");

    this.globalDepartmentConfigDataObject.departments.forEach(department => {

      if (this.relatedDepartments.find(departmentId => departmentId == department.departmentId) == undefined) {

        relatedDepartmentCheckboxAlert.addInput({
          type: "radio",
          label: department.departmentName,
          value: department.departmentId.toString()
        });

      }

    });

    relatedDepartmentCheckboxAlert.addButton("Cancel");
    relatedDepartmentCheckboxAlert.addButton({
      text: "OK",
      handler: data => {
        this.addRelatedDepartment(data);
      }
    });
    relatedDepartmentCheckboxAlert.present();
  }

}
