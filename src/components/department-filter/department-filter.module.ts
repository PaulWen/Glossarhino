import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepartmentFilterComponent } from './department-filter';
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    DepartmentFilterComponent,
  ],
  imports: [
    IonicPageModule.forChild(DepartmentFilterComponent),
    TranslateModule
  ],
  exports: [
    DepartmentFilterComponent
  ]
})
export class DepartmentFilterComponentModule {}
