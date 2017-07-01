import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, AlertController } from "ionic-angular";
import { AttachmentDataObject } from "../../providers/dataobjects/attachment.dataobject";

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

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, alertCtrl: AlertController) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;
    this.alertCtrl = alertCtrl;

    //get navParams
    this.attachments = this.navParams.get("attachments");
    this.isEditMode = this.navParams.get("isEditMode");
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
    let showAddAttachmentAlert = this.alertCtrl.create({
        title: "Add attachment",
        message: "Enter a name and an URL for the attachment:",
        inputs: [
          {
            name: "name",
            placeholder: "Name"
          }, {
            name: "url",
            placeholder: "URL"
          }
        ],
        buttons: [
          {
            text: "Cancel"
          }, {
            text: "Add",
            handler: data => {
              this.addAttachment(data);
            }
          }
        ]
      });
      showAddAttachmentAlert.present();
  }


}
