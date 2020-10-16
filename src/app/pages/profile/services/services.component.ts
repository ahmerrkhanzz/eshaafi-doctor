import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { textValidator } from "src/app/shared/globalfunctions";
import { ProfileService } from "../profile.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-services",
  templateUrl: "./services.component.html",
  styleUrls: ["./services.component.scss"],
})
export class ServicesComponent implements OnInit {
  public servicesForm: FormGroup;
  public textValidator = textValidator;
  public selectedDoctor: any = {};
  public loading: boolean = false;
  @Output() proceed = new EventEmitter<object>(null);

  constructor(
    private formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private _toast: ToastrService
  ) {}

  ngOnInit(): void {
    this._profileService.loggedInUser.subscribe((res) => {
      if (res) {
        this.servicesForm = this.formBuilder.group({
          service: this.formBuilder.array([this.initServicesForm()]),
        });
        this.selectedDoctor = res;
        let control = <FormArray>this.servicesForm.controls["service"];
        this.selectedDoctor.services.forEach((element) => {
          control.push(this.updateServicesForm(element));
        });
        control.removeAt(0);
      }
    });
  }

  initServicesForm() {
    return this.formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      id: [null],
      doctor_serice_id: [null],
    });
  }

  updateServicesForm(object) {
    return this.formBuilder.group({
      id: [object.id],
      name: [object.name, Validators.required],
      doctor_serice_id: [object.doctor_serice_id],
    });
  }

  get services(): FormArray {
    return this.servicesForm.get("service") as FormArray;
  }

  /**
   *
   * Getter method for form controls values
   * @readonly
   * @type {object}
   * @memberof serviceComponent
   */
  getFormControls(index) {
    return this.servicesForm["controls"].service["controls"][index].controls;
  }

  addAnother() {
    const control = <FormArray>this.servicesForm.controls["service"];
    control.push(this.initServicesForm());
  }

  removeAnother() {
    const control = <FormArray>this.servicesForm.controls["service"];
    control.removeAt(control.length - 1);
  }

  updateForm() {
    this.loading = true
    const params = {
      services: this.servicesForm.value.service,
    };
    this.selectedDoctor.services = params.services;
    this._profileService.updateDoctorProfile(params).subscribe(
      (res: any) => {
        this.loading = false;
        this._toast.success("Services updated successfully", "Success");
        this._profileService.loggedInUser.next(this.selectedDoctor);
      },
      (err: any) => {
        this.loading = false;
        this._toast.error(err.error.message, "Error");
      }
    );
  }
}
