import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UiSwitchModule } from "ngx-toggle-switch";

import { PagesRoutingModule } from "./pages-routing.module";
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AdminAsideComponent } from "./admin-aside/admin-aside.component";
import { StatsCardComponent } from "./dashboard/stats-card/stats-card.component";


import { HelperService } from "../services/helper.service";
import { VideoCallingService } from "../video-calling/video-calling.service";
import { AuthenticatedApiService } from "../services/authenticated-api.service";
import { AuthService } from "../services/auth.service";


import { ProfileModule } from "./profile/profile.module";
import { LoginModule } from "./login/login.module";
import { PagesService } from "./pages.service";
import { ProfileComponent } from "./profile/profile.component";
import { ConsultationsModule } from "./consultations/consultations.module";
import { SharedModule } from '../components/shared.module';
import { PatientsModule } from './patients/patients.module';
import { NgxNavDrawerModule } from 'ngx-nav-drawer';

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    AdminAsideComponent,
    StatsCardComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    UiSwitchModule,
    PagesRoutingModule,
    NgxNavDrawerModule,
    LoginModule,
    ProfileModule,
    ConsultationsModule,
    SharedModule,
    PatientsModule
  ],
  exports: [
    PagesComponent,
    DashboardComponent,
    AdminAsideComponent,
    StatsCardComponent,
    ProfileComponent,
  ],
  providers: [
    HelperService,
    VideoCallingService,
    AuthenticatedApiService,
    AuthService,
    PagesService,
  ],
})
export class PagesModule {}
