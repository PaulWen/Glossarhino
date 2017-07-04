import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {SingleEntryPage} from "./single-entry";
import { TranslateModule } from "@ngx-translate/core";
import { DepartmentFilterComponentModule } from "../../components/department-filter/department-filter.module";

@NgModule({
  declarations: [
    SingleEntryPage
  ],
  imports: [
    IonicPageModule.forChild(SingleEntryPage),
    TranslateModule,
    DepartmentFilterComponentModule
  ],
  exports: [
    SingleEntryPage
  ]
})
export class SingleEntryPageModule {
}
