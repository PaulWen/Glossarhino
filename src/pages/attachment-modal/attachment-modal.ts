import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, AlertController } from "ionic-angular";
import { AttachmentDataObject } from "../../providers/dataobjects/attachment.dataobject";
import {TranslateService} from "@ngx-translate/core";
import {Logger} from "../../app/logger";
import {Observable} from "rxjs/Rx";

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

  // temp input objects
  private name: string;
  private url: string;

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

  private openAttachment(url: string) {
    //window.location.href = url.href;
    window.open(url, "_system");
  }

  private addAttachment(name: string, url: string) {
    let newAttachment: AttachmentDataObject = {
      "name": name,
      "url": url
    }
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

  private closeAttachmentModal() {
    this.viewCtrl.dismiss({
      attachments: this.attachments
    });
  }

}
