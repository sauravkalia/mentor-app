import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';



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

  updateData(value, subArray) {
    const user = firebase.database().ref(`userData/registerationData/${value}`);
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
