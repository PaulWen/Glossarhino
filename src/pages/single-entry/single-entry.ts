import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DummySingleEntry } from "./dummy-class-single-entry";
import { SingleEntryInterface } from "./single-entry-interface";
import { Attachment } from "../../providers/model/attachment-model";
import { DummyResolveDepartment } from "../../providers/model/dummy-resolve-department";

@IonicPage()
@Component({
  selector: 'page-single-entry',
  templateUrl: 'single-entry.html',
})
export class SingleEntryPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // navParams
  private name: String;

  // access interface implementation
  private singleEntryInterface: SingleEntryInterface;

  // dummy resolver object
  private dummyResolveDepartment: DummyResolveDepartment;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    // get navParams
    this.name = this.navParams.get("name");

    // instantiate model object for interaction
    this.singleEntryInterface = new DummySingleEntry();

    // instatiate resolver object
    this.dummyResolveDepartment = new DummyResolveDepartment();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleEntryPage');
  }

  private sendMail (emailAddress: String) {
    //window.location.href = "mailto:" + emailAddress;
    window.open("mailto:" + emailAddress, "_system")
  }

  private openAttachmentModal(attachments: Array<Attachment>) {
    let attachmentModal = this.modalCtrl.create("AttachmentModalPage", {
        attachments: attachments
    });
    attachmentModal.present();
}
}
