import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FlexLayoutModule } from '@angular/flex-layout';
//auth
import { AuthGuard } from '../app/auth/auth.guard';
//components
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { PitcherformComponent } from './pitcherform/pitcherform.component';
import { UserpitchersComponent } from './userpitchers/userpitchers.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
//mat
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ClipboardModule } from '@angular/cdk/clipboard';

//routes
import { appRoutes } from './routes';
//services
import { UserService } from './shared/userservice/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DelconfirmDialog } from './edit-pitch/edit-pitch.component';
import { PitcherService } from './shared/pitcherservice/pitcher.service';


//matrial imports

import { FormsModule } from '@angular/forms'
import { MatSidenavModule } from '@angular/material/sidenav';
import { NewPitchComponent } from './new-pitch/new-pitch.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { MatStepperModule } from '@angular/material/stepper';
import { EditPitchComponent } from './edit-pitch/edit-pitch.component';
import { ViewPitchComponent, DialogElementsExampleDialog } from './view-pitch/view-pitch.component';
import { DialoginSharePitch } from './share-pitch/share-pitch.component'
import { ViewFieldComponent } from './view-field/view-field.component';
import { SharePitchComponent } from './share-pitch/share-pitch.component';

import { ViewChartComponent } from './view-chart/view-chart.component';

import { DelpitchDialog } from './userpitchers/userpitchers.component';

//import { CookieService } from "ngx-cookie-service";

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    PitcherformComponent,
    UserpitchersComponent,
    ForgotpasswordComponent,
    ResetpasswordComponent,
    NewPitchComponent,
    InputFieldComponent,
    EditPitchComponent,
    DelconfirmDialog,
    ViewPitchComponent,
    ViewFieldComponent,
    SharePitchComponent,
    ViewChartComponent,
    DialogElementsExampleDialog,
    DelpitchDialog,
    DialoginSharePitch,


  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    NgxChartsModule,
    MatDialogModule,
    MatCardModule,
    ClipboardModule,
    MatFormFieldModule,
    MatStepperModule,
    MatInputModule,
    MatTabsModule,
    MatMenuModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    // MatAutocompleteSelectedEvent,

    MatChipsModule,
    FlexLayoutModule,
    // CookieService




  ],
  providers: [UserService, AuthGuard, DelconfirmDialog, PitcherService,
    
  ],

  bootstrap: [AppComponent],
  entryComponents: [DelconfirmDialog],
})
export class AppModule { }
