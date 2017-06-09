import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TitleBarComponent } from "./title-bar";
import { FocusDirective } from "../../directives/focus/focus";

@NgModule({
  declarations: [
    TitleBarComponent,
    FocusDirective
  ],
  imports: [
    IonicPageModule.forChild(TitleBarComponent),
  ],
  exports: [
    TitleBarComponent
  ]
})
export class TitleBarComponentModule {}
