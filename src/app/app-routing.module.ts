import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";
import { VideoCallingComponent } from "./video-calling/video-calling.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: "./pages/login/login.module#LoginModule",
  },
  {
    path: "",
    loadChildren: "./pages/pages.module#PagesModule",
  },
  {
    path: "not-found",
    component: NotFoundComponent,
  },

  { path: "video-calling", component: VideoCallingComponent },
  { path: "**", redirectTo: "not-found" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
