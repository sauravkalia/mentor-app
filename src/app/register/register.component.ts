import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/index'
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
    let value = this.registerForm.value;

    this.authService.doRegister(value).subscribe();
    
  }
  get f() { return this.registerForm.controls; }

  tryFacebookLogin() {
    this.authService.doFacebookLogin()
      .then(res => {
        this.verifyProfile();
           this.authService.getRegisterData(res).subscribe();
          if(this.authService.userExist){
            //user already present
            this.router.navigate(['/login']);
          }else {
            this.authService.doRegister(res).subscribe();
          }
      }, err => console.log(err)
      )
  }

  tryTwitterLogin() {
    this.authService.doTwitterLogin()
      .then(res => {
        this.verifyProfile();
           this.authService.getRegisterData(res).subscribe();
          if(this.authService.userExist){
            //user already present
            this.router.navigate(['/login']);
          }else {
            this.authService.doRegister(res).subscribe();
          }
        
      }, err => console.log(err)
      )
  }
  

  tryGoogleLogin() {
    this.authService.doGoogleLogin()
      .then(res => {
         this.verifyProfile();
           this.authService.getRegisterData(res).subscribe((userExist) => {
            if(!userExist){
              this.authService.doRegister(res.additionalUserInfo.profile).subscribe();
              console.log('registeration done');
              this.router.navigate(['/login']);
            }else {
              console.log('user is already registered');
              this.router.navigate(['/login']);
            }
           });
           }, err => console.log(err)
      )
  }

  
  verifyProfile() {
    // check profile of social login user
    let m= confirm('Your Profile is Mentor');
    if(m === true){
      console.log('yes i am a mentor');
      this.registerForm.patchValue({isMentor : true});
     }else {
      console.log('i am a mentee');
      this.registerForm.patchValue({isMentor : false});
    }
  }

  // tryRegister(value) {
  //   this.authService.doRegister(value)
  //     .subscribe(res => {
  //       console.log(res);
  //       this.errorMessage = "";
  //       this.successMessage = "Your account has been created";
  //     }, err => {
  //       console.log(err);
  //       this.errorMessage = err.message;
  //       this.successMessage = "";
  //     })
  // }

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