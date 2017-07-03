import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {EditModalPage} from "./edit-modal";
import { ElasticModule } from 'ng-elastic';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    EditModalPage
  ],
  imports: [
    IonicPageModule.forChild(EditModalPage),
    ElasticModule,
    TranslateModule
  ],
  exports: [
    EditModalPage
  ]
})
export class EditModalPageModule {
}
