import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ViewController} from "ionic-angular";
import {AttachmentDataObject} from "../../providers/dataobjects/attachment.dataobject";

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

  // navParam
  private attachments: Array<AttachmentDataObject>;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;

    //get navParams
    this.attachments = this.navParams.get("attachments");
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

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  /**
   * Method to close the AttachmentModal when pressing the assigned button
   */
  private closeAttachmentModal() {
    this.viewCtrl.dismiss();
  }


}
