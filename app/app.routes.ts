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

export const routes: Routes = [
    {
        path: '',
        component:HospitalSignInComponent
    },
    {
        path: 'hospital-dashboard',
        component: HospitalDashboardComponent
    },
    {
        path:'login',
        component:HospitalSignInComponent
    },
    {
        path: 'hospital-profile',
        component: HospitalProfileComponent
    },
    {
        path:'hospital-sign-up',
        component: HospitalSignUpComponent
    },
    {
        path: 'view-appointments',
        component: ViewAppointmentsComponent
    },
    {
        path: 'campaigns',
        component: CampaignsComponent
    },
    {
        path: 'view-campaigns',
        component: ViewCampaignsComponent
    },
    {
        path: 'emerganzy',
        component: EmerganzyComponent
    },
    {
        path: 'view-emergency',
        component: ViewEmerganzyBloodNeedComponent
    },
    {
        path: 'view-donors',
        component: ViewDonorsComponent
    },
    {
        path: 'reports',
        component: ReportsComponent
    }
    
];
