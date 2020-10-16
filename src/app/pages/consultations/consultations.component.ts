import { Component, OnInit } from "@angular/core";
import { ConsultationsService } from "./consultations.service";
import { Subject, forkJoin } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-consultations",
  templateUrl: "./consultations.component.html",
  styleUrls: ["./consultations.component.scss"],
})
export class ConsultationsComponent implements OnInit {
  public loading: boolean = false;
  private unsubscribe: Subject<any> = new Subject();

  public appointments: any[] = [];
  public page: any;
  public pageSize: any;
  public perPage: any;
  public total: number = 0;
  public currentPage: any;
  public userInfo: any;

  constructor(
    private _consultationsSErvice: ConsultationsService,
    private _toast: ToastrService
  ) {}

  ngOnInit(): void {
    if (localStorage.hasOwnProperty("authUser")) {
      this.userInfo = JSON.parse(localStorage.getItem("authUser"));
      this.getAppointments(this.userInfo.id, this.userInfo.is_instant);
    }
  }

  addDoctorEmitter(event) {
    console.log(event);
  }

  getAppointments = (id: number, is_instant: boolean) => {
    this.loading = true;
    this._consultationsSErvice
      .getAppointments(id, is_instant, { device_type: "web" })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (res: any) => {
          const { data, current_page, total } = res;
          console.log(res);

          this.appointments = data;
          this.page = current_page;
          this.total = total;
          this.formatGalleryImages();
          this.loading = false;
          console.log(this.appointments);
        },
        (err: any) => {
          this.loading = false;
          this._toast.error(err.error.message, "Error");
          console.log(err);
        }
      );
  };

  formatGalleryImages = () => {
    this.appointments.forEach((element) => {
      let doctorImages = [];
      element.doctor_files.forEach((e) => {
        let temp = {
          small:
            e.file_type === "image"
              ? e.file
              : "../../../../../assets/images/pdf-placeholder.jpg",
          medium:
            e.file_type === "image"
              ? e.file
              : "../../../../../assets/images/pdf-placeholder.jpg",
          big:
            e.file_type === "image"
              ? e.file
              : "../../../../../assets/images/pdf-placeholder.jpg",
          url: e.file,
          description:
            e.file_type !== "image"
              ? `<a class="btn btn-outline-primary" href="${e.file}" target="_blank">Open PDF</a>`
              : "",
        };
        doctorImages.push(temp);
        element.doctorGalleryImages = doctorImages;
      });
      let patientImages = [];
      element.patient_files.forEach((e) => {
        let temp = {
          small:
            e.file_type === "image"
              ? e.file
              : "../../../../../assets/images/pdf-placeholder.jpg",
          medium:
            e.file_type === "image"
              ? e.file
              : "../../../../../assets/images/pdf-placeholder.jpg",
          big:
            e.file_type === "image"
              ? e.file
              : "../../../../../assets/images/pdf-placeholder.jpg",
          url: e.file,
          description:
            e.file_type !== "image"
              ? `<a class="btn btn-outline-primary" href="${e.file}" target="_blank">Open PDF</a>`
              : "",
        };
        patientImages.push(temp);
        element.patientGalleryImages = patientImages;
      });
    });
  };

  recallAppointments(event) {
    console.log(event);
    if (event) {
      this.getAppointments(this.userInfo.id, this.userInfo.is_instant);
    }
  }
}
