import { Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { AuthGuard } from './auth/auth.guard';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SharePitchComponent } from './share-pitch/share-pitch.component';

import { PitcherformComponent } from './pitcherform/pitcherform.component';

import { UserpitchersComponent } from './userpitchers/userpitchers.component';

import { NewPitchComponent } from './new-pitch/new-pitch.component';
import { EditPitchComponent } from './edit-pitch/edit-pitch.component';
import { ViewPitchComponent } from './view-pitch/view-pitch.component';



export const appRoutes: Routes = [
    {
        path: 'signup', component: SignUpComponent

    },
    {
        path: 'signin', component: SignInComponent
    },
    {
        path: 'password', component: ForgotpasswordComponent
    },
    {
        path: 'reset/:token', component: ResetpasswordComponent
    },
    {

        path: 'pitchform', component: PitcherformComponent
    },

    {
        path: 'userpitchers', component: UserpitchersComponent, canActivate: [AuthGuard]
    },
    {
        path: 'newpitch', component: NewPitchComponent, canActivate: [AuthGuard]
    },
    {
        path: 'edit/:id', component: EditPitchComponent, canActivate: [AuthGuard]
    },
    {
        path: '', component: SignInComponent
    },
    {
        path: 'view/:id', component: ViewPitchComponent, canActivate: [AuthGuard]
    },
    {
        path: 'sharepitch/:id', component: SharePitchComponent
    }
];