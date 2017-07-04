import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from "ionic-angular";
import { Logger } from "../../app/logger";
import { AppModelService } from "../../providers/app-model-service";
import { CommentDataObject } from "../../providers/dataobjects/comment.dataobject";
import { EntryDataObject } from "../../providers/dataobjects/entry.dataobject";
import { UserLanguageFilterConfigDataObject } from "../../providers/dataobjects/user-language-filter-config.dataobject";
import { UserDataObject } from "../../providers/dataobjects/user.dataobject";
import { CommentModalModelInterface } from "./comment-modal.model-interface";

@IonicPage()
@Component({
  selector: "page-comment-modal",
  templateUrl: "comment-modal.html"
})
export class CommentModalPage {
  ////////////////////////////////////////////Properties/////////////////////////////////////////////
  // ionic injected components
  private navCtrl: NavController;
  private navParams: NavParams;
  private viewCtrl: ViewController;
  private loadingCtrl: LoadingController;

  // navParams
  private entry: EntryDataObject;

  // model object
  private appModelService: CommentModalModelInterface;

  // data objects
  private commentContent: string;
  private currentUser: UserDataObject;
  private selectedLanguage: UserLanguageFilterConfigDataObject;

  ////////////////////////////////////////////Constructor////////////////////////////////////////////
  constructor(navCtrl: NavController, navParams: NavParams, viewCtrl: ViewController, loadingCtrl: LoadingController, appModel: AppModelService) {
    // instantiate ionic injected components
    this.navCtrl = navCtrl;
    this.navParams = navParams;
    this.viewCtrl = viewCtrl;
    this.loadingCtrl = loadingCtrl;

    // get navParams
    this.entry = this.navParams.get("entry");

    // instantiate model object
    this.appModelService = appModel;
  }

  /////////////////////////////////////////////Methods///////////////////////////////////////////////

  //////////////////////////////////////////
  //      Ionic Lifecycle Functions       //
  //////////////////////////////////////////

  private ionViewCanEnter(): Promise<boolean> {
    return this.appModelService.isAuthenticated(this.loadingCtrl);
  }

  private ionViewWillEnter() {
    this.loadData();
  }

  //////////////////////////////////////////
  //           Page Functions             //
  //////////////////////////////////////////

  private loadData() {
    // load user data
    this.appModelService.getCurrentUser().then((data) => {
      this.currentUser = data;
    }, (error) => {
      Logger.log("Loading user data failed (Class: CommentModalPage, Method: loadData()");
      Logger.error(error);
    });

    // get selected language
    this.appModelService.getSelectedLanguage().then((data) => {
      this.selectedLanguage = data;

    }, (error) => {
      Logger.log("Loading selected language failed (Class: CommentModalPage, Method: loadData()");
      Logger.error(error);
    });
  }

  private addComment() {

    let newComment: CommentDataObject = CommentDataObject.init(this.commentContent, this.currentUser.name, this.currentUser.email, new Date());

    this.entry.comments = this.entry.comments ? this.entry.comments : [];

    this.entry.comments.push(newComment);
    this.commentContent = null;

    this.appModelService.setEntryDataObject(this.entry, this.selectedLanguage.selectedLanguage).then(() => {
      Logger.log("Successfully added comment (Class: CommentModalPage, Method: addComment())");
    }, (error) => {
      Logger.log("Adding comment failed (Class: CommentModalPage, Method: addComment())");
      Logger.error(error);
    })
  }

  private sendMail(emailAddress: string) {
    window.open("mailto:" + emailAddress, "_system");
  }

  //////////////////////////////////////////
  //         Navigation Functions         //
  //////////////////////////////////////////

  private closeCommentModal() {
    this.viewCtrl.dismiss();
  }

}
