import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RequestData } from '../register/register.component';




@Injectable()
export class AuthService {

  userExist: boolean;

  constructor(
    public afAuth: AngularFireAuth,
    public http: HttpClient) { }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          console.log(res);
          resolve(res);
        }, err => {
          console.log(err);
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
          console.log(res);
          resolve(res);
        }, err => {
          console.log(err);
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
          console.log(err);
          reject(err);
        });
    });
  }
  doRegister(value) {
    return this.http.post('https://mentoring-app-63b39.firebaseio.com/userData/registerationData.json',
      value
    );
  }

  getRegisterData() {
    return this.http.get<{ [key: string]: RequestData }>('https://mentoring-app-63b39.firebaseio.com/userData/registerationData.json')
      .pipe(
        map(responseData => {
          const regArray: RequestData[] = [];
          console.log(responseData);
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
    if ( emailExist === -1) {
            return false;
          } else {
            return true;
          }
     }


  tryRegister(value, regArray) {
    const emailExist = regArray.findIndex(data => data.email === value.email);
    if (regArray.length !== 0 && emailExist === -1) {
      return false;
    } else {
      return true;
    }
  }

  tryLogin(value, regArray) {
    const user = regArray.find(data => data.email === value.email && data.password === value.password);
    return user;
  }

  trySocial(value, regArray) {
    const user = regArray.find(data => data.email === value.additionalUserInfo.profile.email);
    return user;
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (firebase.auth().currentUser) {
        this.afAuth.auth.signOut();
        resolve();
      } else {
        reject();
      }
    });
  }


}
