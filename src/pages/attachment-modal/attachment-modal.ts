import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ViewController} from "ionic-angular";
import {Attachment} from "../../providers/model/attachment-model";

@IonicPage()
@Component({
  selector: "page-attachment-modal",
  templateUrl: "attachment-modal.html"
})
export class AttachmentModalPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // navParam
  private attachments: Array<Attachment>;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    //get navParams
    this.attachments = this.navParams.get("attachments");
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  /**
   * Method to close the AttachmentModal when pressing the assigned button
   */
  private closeAttachmentModal() {
    this.viewCtrl.dismiss();
  }

  /**
   * Method to open an attachment when selected by the user. Will open in the systems browser.
   * @param url
   */
  private openAttachment(url: string) {
    //window.location.href = url.href;
    window.open(url, "_system");
  }

}
