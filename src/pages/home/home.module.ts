import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from "./home";
import { TitleBarComponentModule } from "../../components/title-bar/title-bar.module";

@NgModule({
    declarations: [
        HomePage
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        TitleBarComponentModule
    ]
})
export class HomePageModule { }
