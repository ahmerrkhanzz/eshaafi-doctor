import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './patients.component';
import { SharedModule } from 'src/app/components/shared.module';
import { PatientsService } from './patients.service';


@NgModule({
  declarations: [PatientsComponent],
  imports: [
    CommonModule,
    PatientsRoutingModule,
    SharedModule
  ],
  exports: [PatientsComponent],
  providers: [PatientsService]
})
export class PatientsModule { }
