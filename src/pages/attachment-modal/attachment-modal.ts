import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AttachmentModalInterface } from "./attachment-modal-interface";
import { DummyAttachmentModal } from "./dummy-class-attachment-modal";

/**
 * Generated class for the AttachmentModalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-attachment-modal',
  templateUrl: 'attachment-modal.html',
})
export class AttachmentModalPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // navParams
  private entryId: number;
  private departmentName: String;

  // access interface implementation
  private attachmentModalInterface: AttachmentModalInterface;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    //get navParams
    this.entryId = this.navParams.get("entryId");
    this.departmentName = this.navParams.get("departmentName");

    // instantiate model object for interaction
    this.attachmentModalInterface = new DummyAttachmentModal();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AttachmentModalPage');
  }

  private closeAttachmentModal() {
    this.viewCtrl.dismiss();
  }

  private openAttachment(url: URL) {
    window.location.href = url.href;
  }

}
