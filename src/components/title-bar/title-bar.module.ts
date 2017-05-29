import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitleBarComponent } from './title-bar';

@NgModule({
  declarations: [
    TitleBarComponent,
  ],
  imports: [
    IonicPageModule.forChild(TitleBarComponent),
  ],
  exports: [
    TitleBarComponent
  ]
})
export class TitleBarComponentModule {}
