import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RequestData } from '../register/register.component';
import { User } from './user.model';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';




@Injectable()
export class AuthService {

  userExist: boolean;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    public afAuth: AngularFireAuth,
    public http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  doTwitterLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          resolve(res);
        }, err => {
          reject(err);
        });
    });
  }
  doRegister(value) {
    return this.http.post('https://mentoring-app-63b39.firebaseio.com/userData/registerationData.json',
      value
    );
  }

  fetchRegisterData(callback) {
    firebase.database().ref(`userData/registerationData`)
    .orderByKey()
    .on('value', (data) => {
      console.log(Object.values(data.val()));
      callback(Object.values(data.val()));
      // return Object.values(data.val());
    });
  }

  getRegisterData() {
    return this.http.get<{ [key: string]: RequestData }>('https://mentoring-app-63b39.firebaseio.com/userData/registerationData.json')
      .pipe(
        map(responseData => {
          const regArray: RequestData[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              regArray.push({ ...responseData[key], id: key });
            }
          }
          return regArray;
        })

      );
  }

  tryRegisterSocial(res, regArray) {
    const emailExist = regArray.findIndex(data => data.email === res.additionalUserInfo.profile.email);
    if (emailExist === -1) {
      return false;
    } else {
      return true;
    }
  }


  tryRegister(value, regArray) {
    const emailExist = regArray.findIndex(data => data.email === value.email);
    if (regArray.length !== 0 && emailExist === -1) {
      return of(false);
    } else {
      return of(true);
    }
  }

  tryLogin(value, regArray) {
    const user = regArray.find(data => data.email === value.email && data.password === value.password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user);
    } else {
      return throwError('Email/Password is incorrect!');
    }
  }

  trySocial(value, regArray) {
    const user = regArray.find(data => data.email === value.additionalUserInfo.profile.email);
    return user;
  }

  tryLogout() {
    return new Promise((resolve, reject) => {
      localStorage.removeItem('currentUser');
      if (firebase.auth().currentUser) {
        firebase.auth().signOut();
      } else {
        this.afAuth.auth.signOut();
      }
      this.currentUserSubject.next(null);
      resolve();
    });
  }


}
