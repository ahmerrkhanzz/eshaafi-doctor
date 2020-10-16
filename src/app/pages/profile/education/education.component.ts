import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewInit,
} from "@angular/core";
import {
  textValidator,
  numericValidator,
  minDateRange,
  maxDateRange,
  removeDuplicates,
} from "src/app/shared/globalfunctions";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "../profile.service";

@Component({
  selector: "app-education",
  templateUrl: "./education.component.html",
  styleUrls: ["./education.component.scss"],
})
export class EducationComponent implements OnInit, AfterViewInit {
  public textValidator = textValidator;
  public numericValidator = numericValidator;
  public minDateRange = minDateRange;
  public maxDateRange = maxDateRange;

  public loading: boolean = false;
  public isEdit: boolean = false;
  public selectedEducation: number;

  startDate: any;
  public educationForm: FormGroup;
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._profileService.loggedInUser.subscribe((res) => {
      if (res) {
        this.educationForm = this.formBuilder.group({
          education: this.formBuilder.array([this.initEducationForm()]),
        });
        this.selectedDoctor = res;
        let control = <FormArray>this.educationForm.controls["education"];
        this.selectedDoctor.education.forEach((element) => {
          if (typeof element.edu_start_date === "string") {
            let startDate = new Date(element.edu_start_date);
            let endDate = new Date(element.edu_end_date);
            element.edu_start_date = {
              year: startDate.getFullYear(),
              month: startDate.getMonth() + 1,
              day: startDate.getDate(),
            };
            element.edu_end_date = {
              year: endDate.getFullYear(),
              month: endDate.getMonth() + 1,
              day: endDate.getDate(),
            };
          }
          control.push(this.updateExperienceForm(element));
        });
        control.removeAt(0);
        this.generatingTimeline();
      }
    });
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  initEducationForm() {
    return this.formBuilder.group({
      id: [null],
      degree: [
        "",
        [
          Validators.required,
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      institute: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      edu_start_date: ["", [Validators.required]],
      edu_end_date: ["", Validators.required],
      edu_country: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
    });
  }

  /**
   * Updating the form array
   *
   * @param {data} object
   * @returns formgroup
   * @memberof EducationComponent
   */
  updateExperienceForm(object) {
    return this.formBuilder.group({
      id: [object.id],
      degree: [object.degree, Validators.required],
      institute: [
        object.institute,
        [Validators.required, Validators.minLength(5)],
      ],
      edu_start_date: [object.edu_start_date, Validators.required],
      edu_end_date: [object.edu_end_date, Validators.required],
      edu_country: [
        object.edu_country,
        [Validators.required, Validators.minLength(5)],
      ],
    });
  }

  addAnother() {
    const control = <FormArray>this.educationForm.controls["education"];
    control.push(this.initEducationForm());
  }

  removeAnother() {
    const control = <FormArray>this.educationForm.controls["education"];
    control.removeAt(control.length - 1);
  }

  /**
   *
   * Getter method for form controls values
   * @readonly
   * @type {object}
   * @memberof EducationComponent
   */
  getFormControls(index) {
    return this.educationForm["controls"].education["controls"][index].controls;
  }

  get educations(): FormArray {
    return this.educationForm.get("education") as FormArray;
  }

  generatingTimeline() {
    this.timelineList = this.selectedDoctor.education.map((e) => ({
      id: e.id,
      start_date: e.edu_start_date,
      end_date: e.edu_end_date,
      country: e.edu_country,
      document: e.degree,
      organization: e.institute,
    }));
  }

  editEducationEmitter(educationId: number) {
    this.selectedEducation = this.selectedDoctor.education.filter(
      (e) => e.id === educationId
    );
    const {
      degree,
      edu_country,
      edu_end_date,
      edu_start_date,
      id,
      institute,
    } = this.selectedEducation[0];
    this.isEdit = true;
    this.educationForm.patchValue({
      id,
      edu_start_date,
      edu_end_date,
      edu_country,
      degree,
      institute,
    });
  }

  updateForm() {
    this.loading = true;
    const params = {
      education: this.educationForm.value.education,
    };

    this.selectedDoctor.education = this.educationForm.value.education;
    this._profileService.updateDoctorProfile(params).subscribe(
      (res: any) => {
        this.loading = false;
        this._toast.success("Education updated successfully", "Success");
        this.selectedDoctor.education.forEach((element) => {
          element.edu_start_date =
            element.edu_start_date.year.toString() +
            "-" +
            element.edu_start_date.month.toString() +
            "-" +
            element.edu_start_date.day.toString();
          element.edu_end_date =
            element.edu_end_date.year.toString() +
            "-" +
            element.edu_end_date.month.toString() +
            "-" +
            element.edu_end_date.day.toString();
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
    this.educationForm.reset();
  }
}
