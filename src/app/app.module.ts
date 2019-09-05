import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './core/auth.guard';
import { AuthService } from './core/auth.service';
import { UserService } from './core/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MentorComponent } from './mentor/mentor.component';
import { MenteeComponent } from './mentee/mentee.component';
import { AppRoutingModule } from './app-routing.module';
import { MyOwnCustomMaterialModule } from 'src/material.module';
import { AlertComponent } from './_components';
import { AuthUserGuard } from './core/authUser.guard';
import { NgxSpinnerModule } from 'ngx-spinner';




@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    MenteeComponent,
    MentorComponent,

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MyOwnCustomMaterialModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgxSpinnerModule
  ],
  providers: [AuthService, UserService, AuthGuard, AuthUserGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
