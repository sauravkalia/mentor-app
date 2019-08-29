import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../core/user.service';
import * as firebase from 'firebase';

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

  profileForm: FormGroup;

  constructor(
    public authService: AuthService,
    private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private detectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    let email = this.route.snapshot.data.email;
    if (!email) {
      email = JSON.parse(localStorage.getItem('currentUser')).email;
      console.log(email);
    }
    firebase.database().ref(`userData/registerationData`)
      .orderByChild('email')
      .equalTo(email)
      .on('value', (data) => {
        this.mentorUser = Object.values(data.val())[0];
        this.mentorUser.id = Object.keys(data.val())[0];
        this.detectorRef.detectChanges();
        console.log(this.mentorUser);
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
