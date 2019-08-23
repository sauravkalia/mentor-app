import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/index';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  isMentor: boolean;

  registerData = [];

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,

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
    });
  }
  ngOnInit() {}

  onSubmit() {
    this.submitted = true;
    const value = this.registerForm.value;
    this.authService.getRegisterData().subscribe((regArray) => {
        const ue = this.authService.tryRegister(value, regArray);
        if (ue) {
          console.log('user exists');
          this.router.navigate(['/login']);
          } else {
            this.authService.doRegister(value).subscribe();
            console.log('registration done');
            this.router.navigate(['/login']);
          }
    });
  }
  get f() { return this.registerForm.controls; }

  tryFacebookLogin() {
    this.authService.doFacebookLogin()
      .then(res => {
        this.verifyProfile();
        this.authService.getRegisterData().subscribe((regArray) => {
          if (this.authService.tryRegisterSocial(res, regArray)) {
             console.log('user is present');
          } else {
            this.authService.doRegister(res.additionalUserInfo.profile);
            console.log('user registered');
          }
           });
          }, err => console.log(err)
      );
  }

  tryTwitterLogin() {
    this.authService.doTwitterLogin()
      .then(res => {
        this.verifyProfile();
        this.authService.getRegisterData().subscribe((regArray) => {
          if (this.authService.tryRegisterSocial(res, regArray)) {
             console.log('user is present');
          } else {
            this.authService.doRegister(res.additionalUserInfo.profile);
            console.log('user registered');
          }
           });
          }, err => console.log(err)
      );
  }


  tryGoogleLogin() {
    this.authService.doGoogleLogin()
      .then(res => {
         this.verifyProfile();
         this.authService.getRegisterData().subscribe((regArray) => {
           if (this.authService.tryRegisterSocial(res, regArray)) {
              console.log('user is present');
              const user = this.authService.trySocial(res, regArray);
              if (user) {
                if (user.isMentor) {
                  this.router.navigate(['/mentor']);
                } else {
                  this.router.navigate(['/mentee']);
                }
              }
           } else {
             this.authService.doRegister(res.additionalUserInfo.profile);
             console.log('user registered');
             const user = this.authService.trySocial(res, regArray);
             if (user) {
                if (user.isMentor) {
                  this.router.navigate(['/mentor']);
                } else {
                  this.router.navigate(['/mentee']);
                }
              }

           }
            });
           }, err => console.log(err)
      );
  }


  verifyProfile() {
    const m = confirm('Your Profile is Mentor');
    if (m === true) {
      console.log('yes i am a mentor');
      this.registerForm.patchValue({isMentor : true});
     }else {
      console.log('i am a mentee');
      this.registerForm.patchValue({isMentor : false});
    }
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
