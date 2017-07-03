import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {CommentModalPage} from "./comment-modal";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    CommentModalPage
  ],
  imports: [
    IonicPageModule.forChild(CommentModalPage),
    TranslateModule
  ],
  exports: [
    CommentModalPage
  ]
})
export class CommentModalPageModule {
}
