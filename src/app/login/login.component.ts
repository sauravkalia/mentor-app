import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../core/user.service';
import { AlertService } from '../core/alert.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {

    if (this.authService.currentUserValue) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser) {
        if (currentUser.isMentor) {
          const redirectRoute = this.router.config.find(r => r.path === 'mentor');
          redirectRoute.data = { email: currentUser.email };
          this.router.navigate(['/mentor']);
        } else {
          const redirectRoute = this.router.config.find(r => r.path === 'mentee');
          redirectRoute.data = { email: currentUser.email };
          this.router.navigate(['/mentee']);
        }
      }
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  get f() { return this.loginForm.controls; }



  doLogin(value) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.getRegisterData()
      .subscribe(regArray => {
        this.authService.tryLogin(value, regArray)
          .subscribe(
            user => {
              if (user) {
                if (user.isMentor) {
                  const route = this.router.config.find(r => r.path === 'mentor');
                  route.data = { user };
                  this.router.navigateByUrl('/mentor');

                } else {
                  const route = this.router.config.find(r => r.path === 'mentee');
                  route.data = { user };
                  this.router.navigateByUrl('/mentee');
                }
              }
            },
            error => {
              this.alertService.error(error);
              this.loading = false;
            });

      });
  }
}
