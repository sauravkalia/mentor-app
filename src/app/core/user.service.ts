import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { of, Subject, BehaviorSubject } from 'rxjs';



@Injectable()
export class UserService {

  currentUser: string;

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    public http: HttpClient,
    public authService: AuthService,
  ) {
  }


  updateData(value, subArray) {
    const user = firebase.database().ref(`userData/registerationData/${value}`);
    console.log(user);
    user.update({
      subject: subArray
    });
  }

  getUsers() {
    let mentors = [];
    const user = firebase.database().ref(`userData/registerationData`)
      .orderByChild('isMentor')
      .equalTo(true)
      .on('value', (data) => {
        mentors = Object.values(data.val());
      });
    return mentors;
  }

}
