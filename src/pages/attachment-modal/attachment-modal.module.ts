import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {AttachmentModalPage} from "./attachment-modal";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    AttachmentModalPage
  ],
  imports: [
    IonicPageModule.forChild(AttachmentModalPage),
    TranslateModule
  ],
  exports: [
    AttachmentModalPage
  ]
})
export class AttachmentModalPageModule {
}
