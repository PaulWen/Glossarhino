import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Attachment } from "../../providers/model/attachment-model";

@IonicPage()
@Component({
  selector: 'page-attachment-modal',
  templateUrl: 'attachment-modal.html',
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttachmentModalPage');
  }

  private closeAttachmentModal() {
    this.viewCtrl.dismiss();
  }

  private openAttachment(url: URL) {
    //window.location.href = url.href;
    window.open(url.href, "_system")
  }

}
