import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, AlertController } from "ionic-angular";
import { AttachmentDataObject } from "../../providers/dataobjects/attachment.dataobject";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";
import {Logger} from "../../app/logger";

@IonicPage()
@Component({
  selector: "page-attachment-modal",
  templateUrl: "attachment-modal.html"
})
export class AttachmentModalPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private viewCtrl: ViewController;
  private alertCtrl: AlertController;

  // navParams
  private attachments: Array<AttachmentDataObject>;
  private isEditMode: boolean;

  // other
  private translateService: TranslateService;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, alertCtrl: AlertController,translateService: TranslateService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;
    this.alertCtrl = alertCtrl;

    //get navParams
    this.attachments = this.navParams.get("attachments");
    this.isEditMode = this.navParams.get("isEditMode");

    // other
    this.translateService = translateService;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  /**
   * Method to open an attachment when selected by the user. Will open in the systems browser.
   * @param url
   */
  private openAttachment(url: string) {
    //window.location.href = url.href;
    window.open(url, "_system");
  }

  private addAttachment(newAttachment: AttachmentDataObject) {
    this.attachments.push(newAttachment);
  }

  private removeAttachment(attachmentToRemove: AttachmentDataObject) {
    let index: number = this.attachments.findIndex(attachment => attachment == attachmentToRemove);
    if (index > -1) {
      this.attachments.splice(index, 1);
    }

  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  /**
   * Method to close the AttachmentModal when pressing the assigned button
   */
  private closeAttachmentModal() {
    this.viewCtrl.dismiss({
      attachments: this.attachments
    });
  }

  private showAddAttachmentAlert() {
    Observable.zip(
      this.translateService.get("ADD_ATTACHMENTS"),
      this.translateService.get("ADD_ATTACHMENT_ALERT_INTRO"),
      this.translateService.get("NAME"),
      this.translateService.get("URL"),
      this.translateService.get("CANCEL"),
      this.translateService.get("ADD"),
      (addAttachment: string, addAttachmentAlertIntro: string, name: string, url: string, cancel: string, add: string) => {
        return this.alertCtrl.create({
          title: addAttachment,
          message: addAttachmentAlertIntro,
          inputs: [
            {
              name: "name",
              placeholder: name
            }, {
              name: "url",
              placeholder: url
            }
          ],
          buttons: [
            {
              text: cancel
            }, {
              text: add,
              handler: data => {
                this.addAttachment(data);
              }
            }
          ]
        })
      }
    ).subscribe((alert)=>{
      alert.present();
    });
  }

}
