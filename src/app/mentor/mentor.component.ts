import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/user.service';
import * as firebase from 'firebase';
import { AlertService } from '../core/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-mentor',
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.scss']
})
export class MentorComponent implements OnInit {
  mentorSubject: string[] = [];
  mentorUser;
  mentorList = [];
  loading = false;


  subjects = this.userService.subjects;

  profileForm: FormGroup;

  constructor(
    public authService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private detectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService
  ) {
    this.spinner.show();
    setTimeout(() => {
        /** spinner ends after 5 seconds */
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
        this.mentorUser = Object.values(data.val())[0];
        this.mentorUser.id = Object.keys(data.val())[0];
        this.detectorRef.detectChanges();
      });


  }

  onStore(subject) {
    const index = this.mentorSubject.findIndex(sub => sub === subject.name);
    if (index > -1) {
      this.mentorSubject.splice(index, 1);
    } else {
      this.mentorSubject.push(subject.name);
    }
  }

  onSaveData() {
    this.loading = true;
    this.userService.updateData(this.mentorUser.id, this.mentorSubject);
    this.alertService.success(`Congrates! Your topics are Submitted.`);
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

  isSelected(subject) {
    return this.mentorSubject.findIndex(sub => sub === subject);
  }


}
