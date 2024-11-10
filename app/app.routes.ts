import { Routes } from '@angular/router';
import { HospitalDashboardComponent } from './hospital-dashboard/hospital-dashboard.component';
import { HospitalSignInComponent } from './hospital-sign-in/hospital-sign-in.component';
import { HospitalProfileComponent } from './hospital-profile/hospital-profile.component';
import { HospitalSignUpComponent } from './hospital-sign-up/hospital-sign-up.component';
import { ViewAppointmentsComponent } from './view-appointments/view-appointments.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { ViewCampaignsComponent } from './view-campaigns/view-campaigns.component';
import { EmerganzyComponent } from './emerganzy/emerganzy.component';
import { ViewEmerganzyBloodNeedComponent } from './view-emerganzy-blood-need/view-emerganzy-blood-need.component';
import { ViewDonorsComponent } from './view-donors/view-donors.component';
import { ReportsComponent } from './reports/reports.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {   path: '',
        redirectTo: '/login',
        pathMatch: 'full' },
    {
        path: 'hospital-dashboard',
        component: HospitalDashboardComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'login',
        component:HospitalSignInComponent
    },
    {
        path: 'hospital-profile',
        component: HospitalProfileComponent,
        canActivate: [AuthGuard]
    },
    {
        path:'hospital-sign-up',
        component: HospitalSignUpComponent
    },
    {
        path: 'view-appointments',
        component: ViewAppointmentsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'campaigns',
        component: CampaignsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'view-campaigns',
        component: ViewCampaignsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'emerganzy',
        component: EmerganzyComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'view-emergency',
        component: ViewEmerganzyBloodNeedComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'view-donors',
        component: ViewDonorsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [AuthGuard]
    }
    
];
