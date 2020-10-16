import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  constructor(
    public toast: ToastrService,
  ) { }

  showToast(message: string = 'Success', status: string = 'success', duration = 2000) {
    if(status == 'success') {
      this.toast.success(message);
    } else {
      this.toast.error(message);
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    let message = '';
    let formIsValid = true;
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        if (control.invalid) {
          formIsValid = false;
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
    if (!formIsValid) {
      this.showToast(message, 'error');
      return false;
    } else {
      return true;
    }
  }
}
