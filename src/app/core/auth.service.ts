import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { RequestData } from '../register/register.component';
import { post } from 'selenium-webdriver/http';

@Injectable()
export class AuthService {

  constructor(
   public afAuth: AngularFireAuth,
   public http: HttpClient
 ){}

  doFacebookLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doTwitterLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        console.log(res);
        this.getRegisterData(res.additionalUserInfo.profile).subscribe()
        
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doRegister(value){
    return this.http.post('https://mentoring-app-63b39.firebaseio.com/userData/registerationData.json',
    value
    );  
  }

  getRegisterData(value) {
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
        }),
        map(post => {
          // let usernameExist = post.findIndex(data => data.username === value.username);
          let emailExist = post.findIndex(data => data.email === value.email);
          
          if ( emailExist === -1) {
            this.doRegister(value).subscribe();
          } else {
            console.log('email already exits');
          }
        })
        )
      }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        console.log(res);
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.auth.signOut();
        resolve();
      }
      else{
        reject();
      }
    });
  }

  doCheckProfile() {
    window.alert("Choose one profile");
    
  }

}
