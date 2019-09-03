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
   socialData: {email: string, firstName: string, lastName: string, isMentor: boolean, subject: string, password: string};

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
        console.log(res);
        this.authService.getRegisterData().subscribe((regArray) => {
          if (!this.authService.tryRegisterSocial(res, regArray)) {
            this.authService.doRegister(this.storeSocialData(res.additionalUserInfo.profile)).subscribe();
            this.alertService.success('user is registered!');
           } else {
            this.alertService.success('user is already registered!');
           }
            });
           }
      );
  }



  tryGoogleLogin() {
    this.authService.doGoogleLogin()
      .then(res => {
        this.authService.getRegisterData().subscribe((regArray) => {
          if (!this.authService.tryRegisterSocial(res, regArray)) {
            this.authService.doRegister(this.storeSocialData(res.additionalUserInfo.profile)).subscribe();
            this.alertService.success('user is registered!');
           } else {
            this.alertService.success('user is already registered!');
           }
            });
           }
      );
  }

  storeSocialData(value) {
    this.socialData = {
      email: value.email,
      firstName: value.given_name,
      lastName: value.family_name,
      isMentor: this.verifyProfile(),
      subject: '',
      password: this.choosePassword()
    };
    return this.socialData;
  }




  verifyProfile() {
    const m = confirm('Your Profile is Mentor');
    if (m === true) {
      return true;
     }else {
      return false;
    }
  }

  choosePassword() {
    const password = prompt('Type your password');
    return password;
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
