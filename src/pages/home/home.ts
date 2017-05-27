import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ShowWordPage } from '../show-word/show-word';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  showWordPage = ShowWordPage;

  public toggled: boolean;

  constructor(public navCtrl: NavController) {
    this.toggled = false;
  }

  toggleSearch() {
       this.toggled = this.toggled ? false : true;
  }

  onInput (event: Event) {
    this.toggleSearch()
  }

  onCancel (event: Event) {
    this.toggleSearch()
  }

}
