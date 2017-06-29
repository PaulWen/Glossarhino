import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { CommentDataObject } from "../../providers/dataobjects/comment.dataobject";
import { CommentModalModelInterface } from "./comment-modal.model-interface";
import { AppModelService } from "../../providers/app-model-service";
import { UserDataObject } from "../../providers/dataobjects/user.dataobject";
import { Logger } from "../../app/logger";
import { SingleEntryPage } from "../single-entry/single-entry";

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
  private comments: Array<CommentDataObject>;

  // model object
  private commentModalModelInterface: CommentModalModelInterface;

  // data objects
  private commentContent: string;
  private currentUser: UserDataObject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;

    // get navParams
    this.comments = this.navParams.get("comments");

    // instantiate model object
    this.commentModalModelInterface = appModel;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewWillEnter() {
    this.loadData();
  }

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  private loadData() {
    this.currentUser = this.commentModalModelInterface.getCurrentUser();
  }

  private addComment() {
    let newComment: CommentDataObject = CommentDataObject.init(this.currentUser.name, this.currentUser.email);
    newComment.content = this.commentContent;
    newComment.timeStamp = new Date();

    if (this.comments == undefined) {
      this.comments = []
    }

    Logger.log(newComment);
    this.comments.push(newComment);
    this.commentContent = null;

    Logger.log(this.comments);
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeCommentModal() {
    this.viewCtrl.dismiss();
  }

}
