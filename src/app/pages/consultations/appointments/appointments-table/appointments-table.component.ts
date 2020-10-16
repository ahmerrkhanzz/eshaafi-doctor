import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { UploadPrescriptionComponent } from "../upload-prescription/upload-prescription.component";
import { Router } from "@angular/router";
import { NgxGalleryOptions, NgxGalleryAction } from "@kolkov/ngx-gallery";
import { NgxGalleryImage } from "@kolkov/ngx-gallery";
import { NgxGalleryAnimation } from "@kolkov/ngx-gallery";
import { VideoCallingService } from "src/app/video-calling/video-calling.service";
import { HelperService } from "src/app/services/helper.service";
import { AuthService } from "src/app/services/auth.service";
import { Subject, forkJoin } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ConsultationsService } from "../../consultations.service";
import { ToastrService } from "ngx-toastr";
import { AddPrescriptionModalComponent } from "../add-prescription-modal/add-prescription-modal.component";

import { PdfViewerComponent } from "../pdf-viewer/pdf-viewer.component";

@Component({
  selector: "app-appointments-table",
  templateUrl: "./appointments-table.component.html",
  styleUrls: ["./appointments-table.component.scss"],
  providers: [ConsultationsService],
})
export class AppointmentsTableComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() page: any;
  @Input() total: any;
  @Output() recallAppointments = new EventEmitter<boolean>(false);

  public loading: boolean = false;
  status = [];
  selectedItems = [];
  dropdownSettings = {};
  appointments: any[] = [];
  pageSize: any;
  perPage: any;
  currentPage: any;
  next: any;
  previous: any;
  authUser: any;
  appointmentsData: any;
  appointmentsTemp: any;
  arrayObj: any;
  objectData: any;
  filteredAppointments: any = [];
  filteredstatus: any = [];

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(
    private _modalService: NgbModal,
    private _router: Router,
    private helperService: HelperService,
    private authService: AuthService,
    private videoCallingService: VideoCallingService,
    private _consultationsSErvice: ConsultationsService,
    private _toast: ToastrService
  ) {}
  private unsubscribe: Subject<any> = new Subject();

  ngOnInit() {
    this.appointments = this.data;
    this.appointmentsData = this.appointments;

    this.authUser = this.authService.getAuthUser();
    this.status = [
      { item_id: "pending", item_text: "Pending", disabled: false },
      { item_id: "canceled", item_text: "Cancelled", disabled: false },
      { item_id: "not_appeared", item_text: "Not appeared", disabled: false },
      { item_id: "completed", item_text: "Completed", disabled: false },
      // { item_id: "expired", item_text: "Expired", disabled: false },
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: "item_id",
      textField: "item_text",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };

    this.galleryOptions = [
      {
        width: "600px",
        height: "400px",
        startIndex: 0,
        thumbnailsColumns: 4,
        arrowPrevIcon: "fa fa-chevron-left",
        arrowNextIcon: "fa fa-chevron-right",
        imageAnimation: NgxGalleryAnimation.Slide,
        thumbnailsAsLinks: true,
        imageDescription: true,
        thumbnailActions: [
          {
            icon: "fa fa-arrow-circle-right",
            onClick: this.deleteImage.bind(this),
            titleText: "delete",
          },
        ],
      },
      // max-width 800
      {
        thumbnails: false,
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false,
      },
    ];

    this.galleryImages = [
      {
        small: "assets/images/records/no-image-available.jpg",
        medium: "assets/images/records/no-image-available.jpg",
        big: "assets/images/records/no-image-available.jpg",
      },
    ];
    this.setAppointmentStatuses();
  }

  deleteImage() {
    console.log("clicked");
  }
  onItemSelect(item: any) {
    console.log(this.filteredstatus);
    if (!this.filteredstatus.some((x) => x == item.item_id)) {
      this.filteredstatus.push(item.item_id);
      this.sortByStatus(this.filteredstatus);
    } else {
      this.sortByStatus(this.filteredstatus);
    }
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  addPrescription(isEPrescribed: boolean, id: number) {
    console.log(id);
    const selectedAppointment = this.appointments.filter(
      (e) => e.appointment_id === id
    );
    console.log(selectedAppointment);
    if (isEPrescribed) {
      this._consultationsSErvice.getPrescriptions(id).subscribe(
        (res: any) => {
          console.log(res);
          this.openPrescriptionModal(res.data, id);
          return;
        },
        (err: any) => {
          console.log(err);
        }
      );
      return;
    }

    if (
      selectedAppointment[0].doctor_files.length &&
      selectedAppointment[0].doctor_files.length === 3
    ) {
      this._toast.error(
        "You have already uploaded of maximum prescriptions for this appointment",
        "Error"
      );
      return;
    }

    const modalRef = this._modalService.open(UploadPrescriptionComponent, {
      size: "lg",
    });
    modalRef.result.then((result) => {
      if (result) {
        this.recallAppointments.emit(true);
        if (result.length) {
          const ar = this.appointments.filter((e) => e.appointment_id === id);
          let temp = {
            small: result[0].file,
            medium: result[0].file,
            big: result[0].file,
          };
          let filess: any = ar[0].doctorGalleryImages.concat(temp);
          let index: any = this.appointments.findIndex(
            (x) => x.appointment_id === id
          );
          this.appointments[index].doctorGalleryImages = filess;
        }
      }
    });
    modalRef.componentInstance.appointment_id = id;
    modalRef.componentInstance.showEPrescription = !selectedAppointment[0]
      .doctor_files.length
      ? true
      : false;
  }
  onItemDeSelect(item: any) {
    if (this.appointments.length) {
      let index = this.filteredstatus.findIndex((x) => x === item.item_id);
      this.filteredstatus.splice(index, 1);
      this.sortByStatus(this.filteredstatus, false);
      if (this.filteredstatus.length === 0) {
        // this.appointments = this.appointmentsData;
        this.filteredAppointments = [];
      }
    } else {
      let index = this.filteredstatus.findIndex((x) => x === item.item_id);
      this.filteredstatus.splice(index, 1);
      // this.appointments = this.appointmentsData;
    }
  }

  videoCall(canCall: boolean, expired: boolean, id: any) {
    if (canCall) {
      this.loadCallCredentials(this.authUser.id, id);
    } else if (expired && !canCall) {
      this._toast.warning("Time has expired", "Error");
      return;
    } else if (!expired && !canCall) {
      this._toast.warning("Too Early", "Error");
      return;
    }
  }

  changeStatus(id: any, appointment_status: any) {
    const user_id = this.authUser.id;
    const params = { status: appointment_status.target.value };
    this._consultationsSErvice
      .changeAppointmentStatus(user_id, id, params)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (successResponse: any) => {
          this.helperService.showToast(successResponse.message, "success");
        },
        (errorResponse: any) => {
          console.log(errorResponse);
        }
      );
  }

  loadCallCredentials(id: any, appointment_id: any) {
    this.loading = true;
    this.videoCallingService
      .makeCall(id, appointment_id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (successResponse: any) => {
          this.loading = false;
          if (
            successResponse.data.is_expired === false &&
            successResponse.data.can_call === true
          ) {
            localStorage.setItem("appointment_id", appointment_id);
            this._router.navigate([`/videoCall`]);
          } else if (
            successResponse.data.is_expired === false &&
            successResponse.data.can_call === false
          ) {
            this._toast.error("Too early", "Error");
          } else {
            this._toast.error("Time has expired", "Error");
          }
        },
        (errorResponse: any) => {
          this.loading = false;
          console.log(errorResponse);
        }
      );
  }

  sortByStatus(status: any, isSelect: any = true) {
    console.log(this.appointments);
    this.loading = true;
    this.filteredAppointments = [];
    this.appointmentsData.forEach((element) => {
      status.forEach((e) => {
        if (element.appointment_status === e) {
          if (isSelect) {
            this.filteredAppointments.push(element);
          } else {
            this.filteredAppointments.push(element);
            // let index = this.filteredAppointments.findIndex(x => x.appointment_status === e);
            // this.filteredAppointments.splice(index, 1);
          }
        }
      });
    });
    if (this.filteredAppointments.length) {
      this.appointments = this.filteredAppointments;
      this.loading = false;
    } else {
      this.appointments = this.appointmentsData;
      this.loading = false;
    }
    console.log(this.appointments);
  }

  // get next and previous appointments
  getPageFromService() {
    this.loading = true;
    const params = { device_type: "web" };
    this._consultationsSErvice
      .getAppointments(
        this.authUser.id,
        this.authUser.is_instant,
        params,
        this.page
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (successResponse: any) => {
          this.appointments = successResponse.data;
          this.appointmentsData = successResponse.data;
          this.currentPage = successResponse.current_page;
          this.total = successResponse.total;
          this.next = successResponse.next;
          this.previous = successResponse.previous;
          this.loading = false;
        },
        (errorResponse: any) => {
          this.loading = false;
        }
      );
  }
  //Loading PDF File in Browser New Tab
  loadPDF() {
    let newUrl = "http://africau.edu/images/default/sample.pdf";
    let currentUrl = window.location.href;
    window.open(currentUrl, "_blank");
    // on your current tab will be opened new url
    location.href = newUrl;
  }
  view(event) {
    console.log(event);
  }

  onImageChange(event) {
    console.log(event);
  }

  public isDisableCancelled: boolean = false;
  setAppointmentStatuses() {
    let currentDateObject = new Date();
    let curentDate = currentDateObject.toLocaleString().split(",");
    let m = currentDateObject.getMinutes();
    let h = currentDateObject.getHours();
    if (h == 0) {
      h = 24;
    }

    let currentTime = h + ":" + m;
    this.appointments.forEach((element) => {
      element.status = [
        { item_id: "pending", item_text: "Pending", disabled: false },
        { item_id: "canceled", item_text: "Cancelled", disabled: false },
        { item_id: "not_appeared", item_text: "Not appeared", disabled: false },
        { item_id: "completed", item_text: "Completed", disabled: false },
        // { item_id: "expired", item_text: "Expired", disabled: false },
      ];
      if (element.appointment_status === "pending") {
        if (
          (new Date() > new Date(element.appointment_date) &&
            Date.parse(curentDate[0] + "," + currentTime)) >
            Date.parse(curentDate[0] + "," + element.appointment_time) &&
          !element.is_expired
        ) {
          this.isDisableCancelled = true;
          element.status.forEach((e) => {
            if (e.item_id !== "canceled") {
              e.disabled = true;
            }
          });
        }

        // else if (
        //   new Date() > new Date(element.appointment_date) &&
        //   Date.parse(curentDate[0] + "," + currentTime) >
        //     Date.parse(curentDate[0] + "," + element.appointment_time) &&
        //   element.is_doctor_called &&
        //   element.is_patient_called
        // ) {
        //   this.status.forEach((e) => {
        //     if (e.item_id === "completed") {
        //       e.disabled = true;
        //     }
        //   });
        // } else if (
        //   new Date() > new Date(element.appointment_date) &&
        //   Date.parse(curentDate[0] + "," + currentTime) >
        //     Date.parse(curentDate[0] + "," + element.appointment_time) &&
        //   !element.is_doctor_called &&
        //   !element.is_patient_called
        // ) {
        //   this.status.forEach((e) => {
        //     if (e.item_id === "expired") {
        //       e.disabled = true;
        //     }
        //   });
        // }
      }
    });
  }


  openPrescriptionModal(data, appointment_id: number) {
    const modalRef = this._modalService.open(AddPrescriptionModalComponent, {
      size: "lg",
    });
    modalRef.result.then((result) => {
      if (result) {
        this.recallAppointments.emit(true);
      }
    });
    modalRef.componentInstance.title = "Prescription";
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.appointmentId = appointment_id;
  }

  openPDFViewer(data) {
    const modalRef = this._modalService.open(PdfViewerComponent, {
      size: "lg",
    });
    // modalRef.result.then((result) => {
    //   if (result) {
    //     this.recallAppointments.emit(true);
    //   }
    // });
    modalRef.componentInstance.title = "Prescription";
    modalRef.componentInstance.data = data;
    // modalRef.componentInstance.appointmentId = appointment_id;
  }

  ngOnChanges(event) {
    console.log(event);
    if (
      event &&
      event.data &&
      event.data.currentValue &&
      event.data.currentValue.length
    ) {
      this.appointments = event.data.currentValue;
      this.appointments = this.data;
      this.appointmentsData = this.appointments;
      this.formatGalleryImages();
    }
  }

  openPDF(id: number) {
    this.loading = true;
    this._consultationsSErvice.getPrescriptions(id).subscribe(
      (res: any) => {
        console.log(res);
        this.openPDFViewer(res.data);
        this.loading = false;
        return;
      },
      (err: any) => {
        this.loading = false;
        console.log(err);
      }
    );
  }

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
}
