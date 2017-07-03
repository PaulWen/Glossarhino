import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {LinkedObjectsModalPage} from "./linked-objects-modal";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    LinkedObjectsModalPage
  ],
  imports: [
    IonicPageModule.forChild(LinkedObjectsModalPage),
    TranslateModule
  ],
  exports: [
    LinkedObjectsModalPage
  ]
})
export class LinkedObjectsModalPageModule {
}
