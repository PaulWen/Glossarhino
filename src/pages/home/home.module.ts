import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {HomePage} from "./home";
import {TranslateModule} from "@ngx-translate/core";
import { DepartmentFilterComponent } from "../../components/department-filter/department-filter";

@NgModule({
  declarations: [
    HomePage,
    DepartmentFilterComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    TranslateModule
  ]
})
export class HomePageModule {
}
