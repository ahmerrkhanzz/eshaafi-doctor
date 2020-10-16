import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ProfileService } from "../profile.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-security",
  templateUrl: "./security.component.html",
  styleUrls: ["./security.component.scss"],
})
export class SecurityComponent implements OnInit {
  public securityForm: FormGroup;
  public selectedDoctor: any;
  public loading: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private _toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.securityForm = this.formBuilder.group({
      old_password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      confirm_password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
    });
  }

  updateForm() {
    const { password, old_password } = this.securityForm.value;
    const params = {
      password,
      old_password,
    };
    this._profileService.updateDoctorProfile(params).subscribe(
      (res: any) => {
        this.loading = false;
        this._toast.success("Password updated successfully", "Success");
        this.clearForm();
      },
      (err: any) => {
        this.loading = false;
        this._toast.error(err.error.message, "Error");
      }
    );
  }

  clearForm() {
    this.securityForm.reset();
  }
}
