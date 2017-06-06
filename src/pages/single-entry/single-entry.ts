import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DummySingleEntry } from "./dummy-class-single-entry";
import { SingleEntryInterface } from "./single-entry-interface";
import { Logger } from "../../app/logger";
import { AttachmentModalPage } from "../attachment-modal/attachment-modal";
import { Attachment } from "../../providers/model/attachment-model";

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

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    // get navParams
    this.name = this.navParams.get("name");

    // instantiate model object for interaction
    this.singleEntryInterface = new DummySingleEntry();
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////
  ionViewDidLoad() {
    Logger.log('ionViewDidLoad SingleEntryPage');
  }

  private sendMail (emailAddress: String) {
    //window.location.href = "mailto:" + emailAddress;
    window.open("mailto:" + emailAddress, "_system")
  }

  private openAttachmentModal(attachments: Array<Attachment>) {
    let attachmentModal = this.modalCtrl.create(AttachmentModalPage, {
        attachments: attachments
    });
    attachmentModal.present();
  }
}
