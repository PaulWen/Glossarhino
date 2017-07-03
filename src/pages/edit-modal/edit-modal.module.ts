import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {EditModalPage} from "./edit-modal";
import { ElasticModule } from 'ng-elastic';

@NgModule({
  declarations: [
    EditModalPage
  ],
  imports: [
    IonicPageModule.forChild(EditModalPage),
    ElasticModule
  ],
  exports: [
    EditModalPage
  ]
})
export class EditModalPageModule {
}
