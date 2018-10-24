import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ngOnInit() {
    const config = {
      apiKey: 'AIzaSyDArE0jndEZQadSAjW_3_3fswfUz9cezkE',
      authDomain: 'app-zap.firebaseapp.com',
      databaseURL: 'https://app-zap.firebaseio.com',
      storageBucket: 'app-zap.appspot.com',
    };
    firebase.initializeApp(config);
  }

}
