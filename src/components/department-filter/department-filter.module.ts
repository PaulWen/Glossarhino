import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DepartmentFilterComponent } from './department-filter';

@NgModule({
  declarations: [
    DepartmentFilterComponent,
  ],
  imports: [
    IonicPageModule.forChild(DepartmentFilterComponent),
  ],
  exports: [
    DepartmentFilterComponent
  ]
})
export class DepartmentFilterComponentModule {}
