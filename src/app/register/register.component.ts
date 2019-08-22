import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service'
import { Router, Params } from '@angular/router';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  errorMessage: string = '';
  successMessage: string = '';
  isMentor: boolean;

  registerData = [];

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }
  createForm() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phonenumber: ['', Validators.required],
      isMentor: ['', Validators.required],
      // mentee: ['', Validators.required]
    });
  }
  ngOnInit() {
    //  this.getRegisterData();
    //  console.log(this.registerData);
  }

  onSubmit() {
    this.submitted = true;
    let value = this.registerForm.value;
    this.authService.getRegisterData(value).subscribe();


  }
  get f() { return this.registerForm.controls; }

  tryFacebookLogin() {
    this.authService.doFacebookLogin()
      .then(res => {
        this.router.navigate(['/user']);
      }, err => console.log(err)
      )
  }

  tryTwitterLogin() {
    this.authService.doTwitterLogin()
      .then(res => {
        this.router.navigate(['/user']);
      }, err => console.log(err)
      )
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin()
      .then(res => {
        this.router.navigate(['/mentor']);
      }, err => console.log(err)
      )
  }

  tryRegister(value) {
    this.authService.doRegister(value)
      .subscribe(res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Your account has been created";
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      })
  }

}

export interface RequestData {
  firstName: string;
  lastName: string;
  username: string;
  email: EmailValidator;
  password: string;
  phone: number;
  mentor: string;
  mentee: string;
  id?: string;
}