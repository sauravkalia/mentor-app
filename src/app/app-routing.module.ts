import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './core';
import { RegisterComponent } from './register';
import { MentorComponent } from './mentor/mentor.component';
import { MenteeComponent } from './mentee/mentee.component';




const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  // { path: 'user', component: UserComponent,  resolve: { data: UserResolver}},
  { path: 'mentor', component: MentorComponent},
  { path: 'mentee', component: MenteeComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
