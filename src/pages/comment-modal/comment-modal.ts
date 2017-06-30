import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CommentDataObject } from "../../providers/dataobjects/comment.dataobject";
import { CommentModalModelInterface } from "./comment-modal.model-interface";
import { AppModelService } from "../../providers/app-model-service";
import { UserDataObject } from "../../providers/dataobjects/user.dataobject";
import { Logger } from "../../app/logger";
import { SingleEntryPage } from "../single-entry/single-entry";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";

@IonicPage()
@Component({
  selector: 'page-comment-modal',
  templateUrl: 'comment-modal.html',
})
export class CommentModalPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private viewCtrl: ViewController;

  // navParams
  private entry: EntryDataObject;

  // model object
  private appModelService: CommentModalModelInterface;

  // data objects
  private commentContent: string;
  private currentUser: UserDataObject;
  private selectedLanguage: UserLanguageFilterConfigDataObject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;

    // get navParams
    this.entry = this.navParams.get("entry");

    // instantiate model object
    this.appModelService = appModel;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> | boolean {
    return this.appModelService.isAuthenticated();
  }

  private ionViewWillEnter() {
    this.loadData();
  }

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  private loadData() {
    this.currentUser = this.appModelService.getCurrentUser();

    // get selected language
    this.appModelService.getSelectedLanguage().then((data) => {
      this.selectedLanguage = data;

    }, (error) => {
      Logger.log("Loading selected language failed (Class: CommentModalPage, Method: loadData()");
      Logger.error(error);
    });
  }

  private addComment() {
    let newComment: CommentDataObject = CommentDataObject.init(this.currentUser.name, this.currentUser.email);
    newComment.content = this.commentContent;
    newComment.timeStamp = new Date();

    if (this.entry.comments == undefined) {
      this.entry.comments = []
    }

    this.entry.comments.push(newComment);
    this.commentContent = null;

    this.appModelService.setEntryDataObject(this.entry, this.selectedLanguage.selectedLanguage).then((data) => {

    })
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeCommentModal() {
    this.viewCtrl.dismiss();
  }

}
