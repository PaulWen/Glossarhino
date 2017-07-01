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

  // navParams
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

  private addRelatedDepartment(newRelatedDepartmentId: string) {
    this.relatedDepartments.push(newRelatedDepartmentId);
    this.relatedDepartments.sort((a, b) => {
      if (a < b)
        return -1;
      if (a > b)
        return 1;
      return 0;
    });
  }

  private removeRelatedDepartment(relatedDepartmentIdToRemove: string) {
    let index: number = this.relatedDepartments.findIndex(relatedDepartmentId => relatedDepartmentId == relatedDepartmentIdToRemove);
    if (index > -1) {
      this.relatedDepartments.splice(index, 1);
    }
  }

  private addRelatedEntry(newRelatedEntryDocumentId: string) {
    this.relatedEntries.push(newRelatedEntryDocumentId);
    this.relatedEntries.sort();
  }

  private removeRelatedEntry(relatedEntryToRemoveDocumentId: string) {
    let index: number = this.relatedEntries.findIndex(relatedDepartmentDocumentId => relatedDepartmentDocumentId == relatedEntryToRemoveDocumentId);
    if (index > -1) {
      this.relatedEntries.splice(index, 1);
    }
  }

  private addSynonym(newSynonym: string) {
    this.synonyms.push(newSynonym);
    this.synonyms.sort();
  }

  private removeSynonym(synonymToRemove: string) {
    let index: number = this.synonyms.findIndex(synonym => synonym == synonymToRemove);
    if (index > -1) {
      this.synonyms.splice(index, 1)
    }
  }

  private addAcronym(newAcronym: string) {
    this.acronyms.push(newAcronym);
    this.acronyms.sort();
  }

  private removeAcronym(acronymToRemove: string) {
    let index: number = this.acronyms.findIndex(acronym => acronym == acronymToRemove);
    if (index > -1) {
      this.acronyms.splice(index, 1)
    }
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeLinkedObjectsModal() {
    this.viewCtrl.dismiss({
      relatedDepartments: this.relatedDepartments,
      relatedEntries: this.relatedEntries,
      synonyms: this.synonyms,
      acronyms: this.acronyms
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

  private showAddSynonymAlert() {
    let showAddSynonymAlert = this.alertCtrl.create({
      title: "Add synonym",
      message: "Enter a synonym to add it",
      inputs: [
        {
          name: "synonym",
          placeholder: "Synonym"
        }
      ],
      buttons: [
        {
          text: "Cancel"
        },
        {
          text: "Add",
          handler: data => {
            this.addSynonym(data.synonym);
          }
        }
      ]
    });
    showAddSynonymAlert.present();
  }

  private showAddAcronymAlert() {
    let showAddAcronymAlert = this.alertCtrl.create({
      title: "Add acronym",
      message: "Enter a acronym to add it",
      inputs: [
        {
          name: "acronym",
          placeholder: "Acronym"
        }
      ],
      buttons: [
        {
          text: "Cancel"
        },
        {
          text: "Add",
          handler: data => {
            this.addAcronym(data.acronym);
          }
        }
      ]
    });
    showAddAcronymAlert.present();
  }

}
