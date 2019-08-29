import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../core/user.service';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    public afAuth: AngularFireAuth,
    public userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      if (currentUser.isMentor) {
        const redirectRoute = this.router.config.find(r => r.path === 'mentor');
        redirectRoute.data = { isMentor: currentUser.isMentor };
        this.router.navigate(['/mentor'], { queryParams: { returnUrl: state.url }});
      } else {
        const redirectRoute = this.router.config.find(r => r.path === 'mentee');
        redirectRoute.data = { isMentor: currentUser.isMentor, email: currentUser.email };
        this.router.navigate(['/mentee'], { queryParams: { returnUrl: state.url }});
      }
      return false;
    }
    return true;
}
}
