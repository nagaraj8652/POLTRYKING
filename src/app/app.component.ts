import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Badge } from '@ionic-native/badge/ngx';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private oneSignal: OneSignal,
    private badge: Badge,
    private storage: Storage,
  ) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.oneSignal.startInit('386c6d46-2238-43af-b93f-82dfa67ba7a3');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

    

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // do something when notification is received
        this.badge.set(1);
        this.badge.increase(1);
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
        this.badge.clear();
      });

      this.oneSignal.endInit();

      this.oneSignal.getIds().then((ids) => {
        this.storage.set('playerID', ids.userId);
      });
    });


  }

  
  
}
