import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "./components/shared.module";
import { NotFoundComponent } from "./not-found/not-found.component";
import { environment } from "src/environments/environment";
import { NgxAgoraModule } from "ngx-agora";
import { VideoCallingComponent } from "./video-calling/video-calling.component";
import { NgxNavDrawerModule } from "ngx-nav-drawer";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HelperService } from "./services/helper.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AuthenticatedApiService } from "./services/authenticated-api.service";
import { HeaderInterceptor } from "./constants/interceptor.service";
import { PagesModule } from './pages/pages.module';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [AppComponent, NotFoundComponent, VideoCallingComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    SharedModule,
    PagesModule,
    NgxAgoraModule.forRoot({ AppID: environment.agora.appId }),
    NgxNavDrawerModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    HelperService,
    AuthenticatedApiService,
    { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [NotFoundComponent, VideoCallingComponent],
})
export class AppModule {}
