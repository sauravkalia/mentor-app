import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../core/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../core';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-mentee',
  templateUrl: './mentee.component.html',
  styleUrls: ['./mentee.component.scss']
})
export class MenteeComponent implements OnInit {
  menteeSubject: string[] = [];
  resultSubject: string[] = [];
  menteeUser;
  mentorList = [];
  loading = false;
  subjects = this.userService.subjects;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private detectorRef: ChangeDetectorRef,
              private spinner: NgxSpinnerService) {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }



  ngOnInit() {
    let email = this.route.snapshot.data.email;
    if (!email) {
      email = JSON.parse(localStorage.getItem('currentUser')).email;
    }
    firebase.database().ref(`userData/registerationData`)
      .orderByChild('email')
      .equalTo(email)
      .on('value', (data) => {
        this.menteeUser = Object.values(data.val())[0];
        this.menteeUser.id = Object.keys(data.val())[0];
        this.detectorRef.detectChanges();
      });


  }
  onStore(subject) {
    const index = this.menteeSubject.findIndex(sub => sub === subject.name);
    if (index > -1) {
      this.menteeSubject.splice(index, 1);
    } else {
      this.menteeSubject.push(subject.name);
    }
  }

  onSaveData() {
    this.mentorList.splice(0);
    this.loading = true;
    this.userService.updateData(this.menteeUser.id, this.menteeSubject);
    this.onCompareData();
    this.loading = false;
  }

  doLogout() {
    this.authService.tryLogout()
      .then((res) => {
        this.router.navigate(['/login']);
      }, (error) => {
        console.log('Logout error', error);
      });
  }

  onCompareData() {
    let mentors = [];
    const user = firebase.database().ref(`userData/registerationData`);
    if (user) {
      user
        .orderByChild('isMentor')
        .equalTo(true)
        .on('value', (data) => {
          mentors = Object.values(data.val());
          this.onCompareBoth(user, mentors);
        });
    }
  }

  onCompareBoth(user, mentors) {
    this.menteeUser.subject.forEach(subject => {
      mentors.forEach(mentor => {
        if (mentor.subject
          && mentor.subject.findIndex((sub) => sub === subject) > -1) {
          const m = { ...mentor };
          const index = this.mentorList.findIndex(val => val.email === mentor.email);
          if (index > -1) {
            this.mentorList[index].subject.push(subject);
          } else {
            m.subject = [subject];
            this.mentorList.push(m);
          }
        }
      });
    });
  }

  isSelected(subject) {
    return this.menteeSubject.findIndex(sub => sub === subject);
  }


}
