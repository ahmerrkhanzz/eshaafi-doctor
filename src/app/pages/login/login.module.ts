import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/services/auth.service';
// import { ToastrModule } from 'ngx-toastr';
import { HelperService } from 'src/app/services/helper.service';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    LoginRoutingModule,
  ],
  providers: [AuthService, HelperService],
  exports: [LoginComponent]
})
export class LoginModule { }
