import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";
import {
  textValidator,
  numericValidator,
  minDateRange,
  maxDateRange,
} from "src/app/shared/globalfunctions";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { ProfileService } from "../profile.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-experience",
  templateUrl: "./experience.component.html",
  styleUrls: ["./experience.component.scss"],
})
export class ExperienceComponent implements OnInit {
  public textValidator = textValidator;
  public numericValidator = numericValidator;
  public minDateRange = minDateRange;
  public maxDateRange = maxDateRange;

  public loading: boolean = false;
  public isEdit: boolean = false;
  public experienceForm: FormGroup;
  public selectedDoctor: any = {};
  @Output() proceed = new EventEmitter<object>(null);

  public timelineList: any[] = [];
  public minDate = { year: 1900, month: 1, day: 1 };
  maxDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  constructor(
    private formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private _toast: ToastrService,
    private cdr: ChangeDetectorRef //
  ) {}

  ngOnInit(): void {
    this._profileService.loggedInUser.subscribe((res) => {
      if (res) {
        this.experienceForm = this.formBuilder.group({
          experience: this.formBuilder.array([this.initExperienceForm()]),
        });
        this.selectedDoctor = res;
        let control = <FormArray>this.experienceForm.controls["experience"];
        this.selectedDoctor.experience.forEach((element) => {
          if (typeof element.exp_start_date === "string") {
            let startDate = new Date(element.exp_start_date);
            let endDate = new Date(element.exp_end_date);
            element.exp_start_date = {
              year: startDate.getFullYear(),
              month: startDate.getMonth() + 1,
              day: startDate.getDate(),
            };
            element.exp_end_date = {
              year: endDate.getFullYear(),
              month: endDate.getMonth() + 1,
              day: endDate.getDate(),
            };
          }
          control.push(this.updateExperienceForm(element));
        });
        control.removeAt(0);
      }
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  initExperienceForm() {
    return this.formBuilder.group({
      id: [null],
      exp_hosp_name: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      exp_desigination: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      exp_start_date: ["", [Validators.required]],
      exp_end_date: ["", Validators.required],
      exp_country: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
    });
  }

  updateExperienceForm(object) {
    return this.formBuilder.group({
      id: [object.id],
      exp_hosp_name: [
        object.exp_hosp_name,
        [Validators.required, Validators.minLength(5)],
      ],
      exp_desigination: [
        object.exp_desigination,
        [Validators.required, Validators.minLength(5)],
      ],
      exp_start_date: [object.exp_start_date, [Validators.required]],
      exp_end_date: [object.exp_end_date, Validators.required],
      exp_country: [
        object.exp_country,
        [Validators.required, Validators.minLength(5)],
      ],
    });
  }

  /**
   *
   * Getter method for form controls values
   * @readonly
   * @type {object}
   * @memberof ExperienceComponent
   */
  getFormControls(index) {
    return this.experienceForm["controls"].experience["controls"][index]
      .controls;
  }

  addAnother() {
    const control = <FormArray>this.experienceForm.controls["experience"];
    control.push(this.initExperienceForm());
  }

  removeAnother() {
    const control = <FormArray>this.experienceForm.controls["experience"];
    control.removeAt(control.length - 1);
  }

  get experiences(): FormArray {
    return this.experienceForm.get("experience") as FormArray;
  }

  generatingTimeline() {
    this.timelineList = this.selectedDoctor.experience.map((e) => ({
      id: e.id,
      start_date: e.exp_start_date,
      end_date: e.exp_end_date,
      country: e.exp_country,
      document: e.exp_desigination,
      organization: e.exp_hosp_name,
    }));
  }

  updateForm() {
    this.loading = true;
    const params = {
      experience: this.experienceForm.value.experience,
    };
    this.selectedDoctor.experience = this.experienceForm.value.experience;
    this._profileService.updateDoctorProfile(params).subscribe(
      (res: any) => {
        this.loading = false;
        this._toast.success("Experience updated successfully", "Success");
        this.selectedDoctor.experience.forEach((element) => {
          element.exp_start_date =
            element.exp_start_date.year.toString() +
            "-" +
            element.exp_start_date.month.toString() +
            "-" +
            element.exp_start_date.day.toString();
          element.exp_end_date =
            element.exp_end_date.year.toString() +
            "-" +
            element.exp_end_date.month.toString() +
            "-" +
            element.exp_end_date.day.toString();
        });
        this._profileService.loggedInUser.next(this.selectedDoctor);
      },
      (err: any) => {
        this.loading = false;
        this._toast.error(err.error.message, "Error");
      }
    );
  }

  cancelForm() {
    this.isEdit = false;
    this.experienceForm.reset();
  }
}
