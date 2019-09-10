import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { of } from 'rxjs';



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

  subjects = [{ id: 1, name: 'Skating' },
  { id: 2, name: 'Boxing' },
  { id: 3, name: 'Karate' },
  { id: 4, name: 'Judo' },
  { id: 5, name: 'Cycling' },
  { id: 6, name: 'Yoga' },
  { id: 7, name: 'Hiking' },
  { id: 8, name: 'Lifting' },
  { id: 9, name: 'SkyDiving' },
  { id: 10, name: 'Machine-Learning' }];

  updateeData(value, subArray) {
    const user = firebase.database().ref(`userData/registerationData/${value}`);
    user.update({
      subject: subArray
    });
  }

  updateData(value, subArray) {
   return new Promise<any>((resolve, reject) => {
    const user = firebase.database().ref(`userData/registerationData/${value}`);
    user.update({
      subject: subArray
    }).then(res => {
      resolve(res);
    }, err => {
      reject(err);
    });
   });
  }

  getUsers() {
    let mentors = [];
    firebase.database().ref(`userData/registerationData`)
      .orderByChild('isMentor')
      .equalTo(true)
      .on('value', (data) => {
        mentors = Object.values(data.val());
      });
    return of(mentors);
  }

  getIntialUser(email) {
    firebase.database().ref(`userData/registerationData`)
      .orderByChild('email')
      .equalTo(email)
      .on('value', (data) => {
        return {
          user: Object.values(data.val())[0],
          id: Object.keys(data.val())[0]
        };
      });
  }
}
