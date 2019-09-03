import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/index';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AlertService } from '../core/alert.service';




@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  isMentor: boolean;

  registerData = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private alertService: AlertService
  ) {

    if (this.authService.currentUserValue) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        if (currentUser.isMentor) {
          const redirectRoute = this.router.config.find(r => r.path === 'mentor');
          redirectRoute.data = { isMentor: currentUser.isMentor };
          this.router.navigate(['/mentor']);
        } else {
          const redirectRoute = this.router.config.find(r => r.path === 'mentee');
          redirectRoute.data = { isMentor: currentUser.isMentor, email: currentUser.email };
          this.router.navigate(['/mentee']);
        }
      }
  }
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phonenumber: ['', [Validators.required, Validators.minLength]],
      isMentor: ['', [Validators.required]],
      subject: ['']
    });
  }
  get f() { return this.registerForm.controls; }

  onSubmit() {

     this.submitted = true;
     if (this.registerForm.invalid) {
            return;
        }

     this.loading = true;
     const value = this.registerForm.value;
     this.authService.getRegisterData()
     .subscribe((regArray) => {
        const ue = this.authService.tryRegister(value, regArray)
        .subscribe(user => {
          if (user) {
            this.alertService.success('user is already registered!');
            this.loading = false;
     } else {
             this.authService.doRegister(value).subscribe();
             this.alertService.success('user is registered!');
             this.loading = false;
            }
        });
    });
  }

  tryFacebookLogin() {
    this.authService.doFacebookLogin()
      .then(res => {
        this.verifyProfile();
        this.authService.getRegisterData().subscribe((regArray) => {
          if (this.authService.tryRegisterSocial(res, regArray)) {
          } else {
            this.authService.doRegister(res.additionalUserInfo.profile);
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
          } else {
            this.authService.doRegister(res.additionalUserInfo.profile);
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
              const user = this.authService.trySocial(res, regArray);
              this.checkUser(user);
           } else {
             this.authService.doRegister(res.additionalUserInfo.profile);
             const user = this.authService.trySocial(res, regArray);
             this.checkUser(user);
           }
            });
           }, err => console.log(err)
      );
  }

  checkUser(user) {
    if (user) {
      if (user.isMentor) {
        this.router.navigate(['/mentor']);
      } else {
        this.router.navigate(['/mentee']);
      }
    }
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
  email: string;
  password: string;
  phone: number;
  isMentor: boolean;
  subject: string;
  id?: string;
}
