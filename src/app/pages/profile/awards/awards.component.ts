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
} from "src/app/shared/globalfunctions";
import { FormGroup, FormBuilder, FormArray, Validators } from "@angular/forms";
import { ProfileService } from "../profile.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-awards",
  templateUrl: "./awards.component.html",
  styleUrls: ["./awards.component.scss"],
})
export class AwardsComponent implements OnInit {
  public textValidator = textValidator;
  public numericValidator = numericValidator;
  public dated;
  public awardsForm: FormGroup;
  public selectedDoctor: any = {};
  @Output() proceed = new EventEmitter<object>(null);
  public timelineList: any[] = [];
  public loading: boolean = false;
  public isEdit: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private _toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this._profileService.loggedInUser.subscribe((res) => {
      if (res) {
        console.log(res);
        
        this.awardsForm = this.formBuilder.group({
          awards: this.formBuilder.array([this.initAwardsForm()]),
        });
        this.selectedDoctor = res;
        let control = <FormArray>this.awardsForm.controls["awards"];
        this.selectedDoctor.awards.forEach((element) => {
          control.push(this.updateAwardsForm(element));
        });
        control.removeAt(0);
      }
    });
  }

  initAwardsForm() {
    return this.formBuilder.group({
      id: [null],
      award_achivements: [
        "",
        Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
      ],
      award_event_name: [
        "",
        Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
      ],
      award_desigination: [
        "",
        Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
      ],
      award_recive_award: [
        "",
        [
          Validators.required,
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      award_recive_from: [
        "",
        Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
      ],
      award_recived_dated: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
      award_country: [
        "",
        [
          Validators.minLength(5),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
    });
  }

  updateAwardsForm(object) {
    return this.formBuilder.group({
      id: [object.id],
      award_achivements: [object.award_achivements],
      award_event_name: [object.award_event_name],
      award_desigination: [object.award_desigination],
      award_recive_award: [object.award_recive_award, Validators.required],
      award_recive_from: [object.award_recive_from],
      award_recived_dated: [
        object.award_recived_dated,
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)],
      ],
      award_country: [object.award_country, [Validators.minLength(5)]],
    });
  }

  /**
   *
   * Getter method for form controls values
   * @readonly
   * @type {object}
   * @memberof awardsComponent
   */
  getFormControls(index) {
    return this.awardsForm["controls"].awards["controls"][index].controls;
  }

  addAnother() {
    const control = <FormArray>this.awardsForm.controls["awards"];
    control.push(this.initAwardsForm());
  }

  removeAnother() {
    const control = <FormArray>this.awardsForm.controls["awards"];
    control.removeAt(control.length - 1);
  }

  get awardsValues(): FormArray {
    return this.awardsForm.get("awards") as FormArray;
  }

  updateForm() {
    this.loading = true;
    const params = {
      awards: this.awardsForm.value.awards,
    };
    this.selectedDoctor.awards = params.awards
    this._profileService.updateDoctorProfile(params).subscribe(
      (res: any) => {
        this.loading = false;
        this._profileService.loggedInUser.next(this.selectedDoctor);
        this._toast.success("Awards updated successfully", "Success");
      },
      (err: any) => {
        this.loading = false;
        this._toast.error(err.error.message, "Error");
      }
    );
  }

  cancelForm() {
    this.isEdit = false;
    this.awardsForm.reset();
  }
}
