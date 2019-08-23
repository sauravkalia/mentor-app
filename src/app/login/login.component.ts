import { Component } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.scss']
})
export class LoginComponent {

  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['', Validators.required]
    });
  }

  doLogin(value) {
    this.authService.getRegisterData().subscribe((regArray) => {
      const user = this.authService.tryLogin(value, regArray);
      console.log(user);
      if (user) {
        if (user.isMentor) {
          this.router.navigate(['/mentor']);
        } else {
          this.router.navigate(['/mentee']);
        }
        console.log('user exists');
        } else {
          console.log('no user found');
        }
  });
  }
}
