import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ShowHidePasswordModule } from "ngx-show-hide-password";

import { ProfileRoutingModule } from './profile-routing.module';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { EducationComponent } from './education/education.component';
import { ExperienceComponent } from './experience/experience.component';
import { AwardsComponent } from './awards/awards.component';
import { SecurityComponent } from './security/security.component';
import { VideoConsultationComponent } from './video-consultation/video-consultation.component';
import { ServicesComponent } from './services/services.component';
import { SharedModule } from 'src/app/components/shared.module';
import { ProfileService } from './profile.service';



@NgModule({
  declarations: [PersonalInformationComponent, EducationComponent, ExperienceComponent, AwardsComponent, SecurityComponent, VideoConsultationComponent, ServicesComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    FontAwesomeModule,
    ShowHidePasswordModule,
    SharedModule,
    ProfileRoutingModule
  ],
  exports: [PersonalInformationComponent, EducationComponent, ExperienceComponent, AwardsComponent, SecurityComponent, VideoConsultationComponent, ServicesComponent],
  providers:[ProfileService]
})
export class ProfileModule { }
