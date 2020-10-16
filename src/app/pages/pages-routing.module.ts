import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { VideoCallingComponent } from "../video-calling/video-calling.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "",
        component: DashboardComponent,
      },
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      {
        path: "online-consultation",
        loadChildren:
          "./consultations/consultations.module#ConsultationsModule",
      },
      {
        path: "profile",
        loadChildren: "./profile/profile.module#ProfileModule",
      },
      {
        path: "patients",
        loadChildren: "./patients/patients.module#PatientsModule",
      },
      {
        path: "videoCall",
        component: VideoCallingComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
