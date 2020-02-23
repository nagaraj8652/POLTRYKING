import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(private nav: NavController, private modalCtrl: ModalController) { }

  ngOnInit() {

  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
