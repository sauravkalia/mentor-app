import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mentor',
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.scss']
})
export class MentorComponent implements OnInit {

  
  mentors = [{ id: 1, subject: 'Skating' },
  { id: 2, subject: 'Boxing' },
 { id: 3, subject: "karate" },
 { id: 4, subject: "Judo" },
 { id: 5, subject: "Cycling" },
 { id: 6, subject: "Yoga" },
 { id: 7, subject: "Hiking" },
 { id: 8, subject: "Lifting" }];

 user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;

  constructor(  
      public authService: AuthService,
      private location : Location,
      private route: ActivatedRoute,
      private fb: FormBuilder
    ) { }

  ngOnInit() {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        this.createForm(this.user.name);
      }
    })
  }

  createForm(name) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required ]
    });
  }
  
  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });
  }

}
