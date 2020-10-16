import { Component, OnInit } from "@angular/core";
import { ProfileService } from "./profile.service";
import { ToastrService } from "ngx-toastr";
import { removeDuplicates } from 'src/app/shared/globalfunctions';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  public selectedDoctor: any;
  public loading: boolean = false;
  tabs = [
    {
      id: 1,
      title: "Personal Information",
    },
    {
      id: 2,
      title: "Education",
    },
    {
      id: 3,
      title: "Experience",
    },
    {
      id: 4,
      title: "Awards",
    },
    {
      id: 5,
      title: "Video Consultation",
    },
    {
      id: 6,
      title: "Services",
    },
    {
      id: 7,
      title: "Security",
    },
  ];
  counter = this.tabs.length + 1;
  active;
  public selectedTab = this.tabs[0];
  public saveDoctorObject: any = {};
  public doctorArray: any[] = [];

  constructor(
    private _profileService: ProfileService,
    private _toast: ToastrService
  ) {}

  ngOnInit(): void {
    this._profileService.loggedInUser.subscribe((res) => {
      if (res && res.id === JSON.parse(localStorage.getItem('authUser')).id) {
        this.selectedDoctor = res;
      } else {
        this.getDoctorProfile();
      }
    });
  }

  getDoctorProfile = () => {
    this.loading = true;
    this._profileService.getDoctorProfile().subscribe(
      (res: any) => {
        this.loading = false;
        this.selectedDoctor = res.data;
        this._profileService.loggedInUser.next(this.selectedDoctor);
      },
      (err: any) => {
        this.loading = false;
        this._toast.error(err.error.message, "Error");
      }
    );
  };

  createSaveObject(params?) {
    let combinedObj = this.doctorArray.reduce(function (result, current) {
      return Object.assign(result, current);
    }, {});
    console.log(combinedObj);
    const {
      image,
      name,
      email,
      password,
      phone,
      city,
      country,
      address,
      pmdc,
      summary,
      language,
      speciality,
      gender,
      date_of_birth,
      education,
      experience,
      awards,
      service,
      video_consultation_fee,
      v_c_waiting_time,
      is_online,
      emailNotification,
      faqs,
      availability,
      video_consult_id,
      is_instant,
    } = combinedObj;
    const saveObject = {
      profile_image: image,
      name: name,
      email: email,
      password: password,
      phone: phone,
      city: city,
      country: country,
      address: address,
      pmdc: pmdc,
      summary: summary,
      is_instant: is_instant,

      speciality: is_instant ? null : speciality,
      gender: gender,
      date_of_birth: date_of_birth,
      education: education,
      experience: experience,
      award: awards,
      services: service,

      faqs: faqs,
    };
    return saveObject;
  }
}
