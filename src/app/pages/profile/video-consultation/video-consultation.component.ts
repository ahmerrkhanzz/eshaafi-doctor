import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { numericValidator } from "src/app/shared/globalfunctions";
import { ToastrService } from "ngx-toastr";
import { ProfileService } from "../profile.service";

@Component({
  selector: "app-video-consultation",
  templateUrl: "./video-consultation.component.html",
  styleUrls: ["./video-consultation.component.scss"],
})
export class VideoConsultationComponent implements OnInit {
  public dob: any;
  public loading: boolean = false;
  public videoForm: FormGroup;
  public numericValidator = numericValidator;
  public waitingTime = [
    {
      id: 1,
      value: "10 mins",
    },
    {
      id: 2,
      value: "15 mins",
    },
    {
      id: 3,
      value: "20 mins",
    },
    {
      id: 4,
      value: "25 mins",
    },
    {
      id: 5,
      value: "30 mins",
    },
  ];
  @Output() proceed = new EventEmitter<object>(null);
  public selectedDoctor: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private _toast: ToastrService,
    private _profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.videoForm = this.formBuilder.group({
      video_consult_id: [null],
      is_online: [false, Validators.required],
      video_consultation_fee: [
        "",
        [Validators.required, Validators.minLength(3), Validators.maxLength(4)],
      ],
      v_c_waiting_time: ["", Validators.required],
      emailNotification: [false, Validators.required],
      availability: this.formBuilder.group({
        monday: this.formBuilder.group({
          video_day: ["Mon"],
          video_day_full: ["Monday"],
          isAvailable: [false],
          video_start_time: [""],
          video_end_time: [""],
          video_duration: [
            "",
            [Validators.minLength(2), Validators.maxLength(2)],
          ],
        }),
        tuesday: this.formBuilder.group({
          video_day: ["Tue"],
          video_day_full: ["Tuesday"],
          isAvailable: [false],
          video_start_time: [""],
          video_end_time: [""],
          video_duration: [""],
        }),
        wednesday: this.formBuilder.group({
          video_day: ["Wed"],
          video_day_full: ["Wednesday"],
          isAvailable: [false],
          video_start_time: [""],
          video_end_time: [""],
          video_duration: [""],
        }),
        thursday: this.formBuilder.group({
          video_day: ["Thu"],
          video_day_full: ["Thursday"],
          isAvailable: [false],
          video_start_time: [""],
          video_end_time: [""],
          video_duration: [""],
        }),
        friday: this.formBuilder.group({
          video_day: ["Fri"],
          video_day_full: ["Friday"],
          isAvailable: [false],
          video_start_time: [""],
          video_end_time: [""],
          video_duration: [""],
        }),
        saturday: this.formBuilder.group({
          video_day: ["Sat"],
          video_day_full: ["Saturday"],
          isAvailable: [false],
          video_start_time: [""],
          video_end_time: [""],
          video_duration: [""],
        }),
        sunday: this.formBuilder.group({
          video_day: ["Sun"],
          video_day_full: ["Sunday"],
          isAvailable: [false],
          video_start_time: [""],
          video_end_time: [""],
          video_duration: [""],
        }),
      }),
    });

    this._profileService.loggedInUser.subscribe((res) => {
      if (res) {
        this.selectedDoctor = res;
        this.patchFormValues();
      }
    });
  }

  /**
   *
   * Getter method for form controls values
   * @readonly
   * @type {object}
   * @memberof PersonalInformationComponent
   */
  get videoFormControls(): any {
    return this.videoForm["controls"];
  }

  /**
   * Gender Selection
   *
   * @param {object} event gender object
   * @memberof PersonalInformationComponent
   */
  changeNotificationSetting(event) {
    console.log(event);
  }

  changeAvailability(event, day) {
    const { availability } = this.videoForm.value;
    for (const available in availability) {
      if (event && day === available) {
        this.videoForm
          .get("availability")
          .get(day)
          .get("video_duration")
          .setValidators([Validators.required]);
        this.videoForm
          .get("availability")
          .get(day)
          .get("video_start_time")
          .setValidators([Validators.required]);
        this.videoForm
          .get("availability")
          .get(day)
          .get("video_end_time")
          .setValidators([Validators.required]);
      } else if (!event && day === available) {
        this.videoForm
          .get("availability")
          .get(day)
          .get("video_duration")
          .clearValidators();
        this.videoForm
          .get("availability")
          .get(day)
          .get("video_start_time")
          .clearValidators();
        this.videoForm
          .get("availability")
          .get(day)
          .get("video_end_time")
          .clearValidators();
      }
      this.videoForm
        .get("availability")
        .get(day)
        .get("video_duration")
        .updateValueAndValidity();
      this.videoForm
        .get("availability")
        .get(day)
        .get("video_end_time")
        .updateValueAndValidity();
      this.videoForm
        .get("availability")
        .get(day)
        .get("video_start_time")
        .updateValueAndValidity();
    }
  }

  avialabilityValidation() {
    let availabilities = [];
    const { availability } = this.videoForm.value;
    for (const available in availability) {
      availabilities.push(availability[available]);
    }
    let isAvailabilities = availabilities.filter((e) => e.isAvailable);
    if (isAvailabilities.length) {
      console.log(isAvailabilities);
      return true;
    }
    return false;
  }

  patchFormValues() {
    const {
      is_online,
      emailNotification,
      v_c_waiting_time,
      video_consultation_fee,
      video_consultation_day,
      video_consult_id,
    } = this.selectedDoctor.video_consultation;
    this.videoForm.patchValue({
      is_online: is_online,
      emailNotification: emailNotification,
      video_consultation_fee: video_consultation_fee,
      v_c_waiting_time: v_c_waiting_time,
      video_consult_id: video_consult_id,
    });
    if (video_consultation_day && video_consultation_day.length) {
      video_consultation_day.forEach((e) => {
        if (typeof e.video_start_time === "string") {
          let startTime = {
            hour: parseInt(e.video_start_time.split(":")[0]),
            minute: parseInt(e.video_start_time.split(":")[1]),
            second: 0,
          };
          let endTime = {
            hour: parseInt(e.video_end_time.split(":")[0]),
            minute: parseInt(e.video_end_time.split(":")[1]),
            second: 0,
          };
          e.video_start_time = startTime;
          e.video_end_time = endTime;
        }

        switch (e.video_day) {
          case "Mon":
            e.isAvailable = true;
            (<FormGroup>this.videoForm.controls["availability"]).controls[
              "monday"
            ].patchValue(e);
            break;
          case "Tue":
            e.isAvailable = true;
            (<FormGroup>this.videoForm.controls["availability"]).controls[
              "tuesday"
            ].patchValue(e);
            break;
          case "Wed":
            e.isAvailable = true;
            (<FormGroup>this.videoForm.controls["availability"]).controls[
              "wednesday"
            ].patchValue(e);
            break;
          case "Thu":
            e.isAvailable = true;
            (<FormGroup>this.videoForm.controls["availability"]).controls[
              "thursday"
            ].patchValue(e);
            break;
          case "Fri":
            e.isAvailable = true;
            (<FormGroup>this.videoForm.controls["availability"]).controls[
              "friday"
            ].patchValue(e);
            break;
          case "Sat":
            e.isAvailable = true;
            (<FormGroup>this.videoForm.controls["availability"]).controls[
              "saturday"
            ].patchValue(e);
            break;
          case "Sun":
            e.isAvailable = true;
            (<FormGroup>this.videoForm.controls["availability"]).controls[
              "sunday"
            ].patchValue(e);
            break;
          default:
            break;
        }
      });
    }
  }

  videoConsultationDaysFormatter(availability, isApi) {
    let selectedDays = [];
    for (const day in availability) {
      if (availability[day].isAvailable) {
        selectedDays.push({
          video_day: availability[day].video_day,
          video_duration: availability[day].video_duration,
          video_end_time: isApi
            ? availability[day].video_end_time
            : availability[day].video_end_time.hour.toString() +
              ":" +
              availability[day].video_end_time.minute.toString(),
          video_start_time: isApi
            ? availability[day].video_start_time
            : availability[day].video_start_time.hour.toString() +
              ":" +
              availability[day].video_start_time.minute.toString(),
        });
      }
    }
    return selectedDays;
  }

  updateForm() {
    this.loading = true;
    this.avialabilityValidation();
    if (!this.avialabilityValidation())
      this._toast.error("Please provide minimum one availability", "Error");
    else {
      const {
        video_consultation_fee,
        v_c_waiting_time,
        is_online,
        emailNotification,
        availability,
        video_consult_id,
      } = this.videoForm.value;
      const params = {
        video_consultation: {
          video_consultation_fee: video_consultation_fee,
          v_c_waiting_time: v_c_waiting_time,
          is_online: is_online,
          video_consult_id: video_consult_id,
          emailNotification: emailNotification,
          video_consultation_day: this.videoConsultationDaysFormatter(
            availability,
            true
          ),
        },
      };
      this.selectedDoctor.video_consultation = {
        video_consultation_fee,
        v_c_waiting_time,
        is_online,
        emailNotification,
        video_consultation_day: this.videoConsultationDaysFormatter(
          availability,
          false
        ),
      };

      this._profileService.updateDoctorProfile(params).subscribe(
        (res: any) => {
          this.loading = false;
          this._toast.success(
            "Video consultation information updated successfully",
            "Success"
          );
          this._profileService.loggedInUser.next(this.selectedDoctor);
        },
        (err: any) => {
          this.loading = false;
          this._toast.error(err.error.message, "Error");
        }
      );
    }
  }
}
