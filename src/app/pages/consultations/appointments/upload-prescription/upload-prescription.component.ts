import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/services/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { HelperService } from "src/app/services/helper.service";
import {
  FileUploadControl,
  FileUploadValidators,
} from "@iplab/ngx-file-upload";
import { ConsultationsService } from "../../consultations.service";
import { ToastrService } from "ngx-toastr";
import { AddPrescriptionModalComponent } from "../add-prescription-modal/add-prescription-modal.component";

@Component({
  selector: "app-upload-prescription",
  templateUrl: "./upload-prescription.component.html",
  styleUrls: ["./upload-prescription.component.scss"],
})
export class UploadPrescriptionComponent implements OnInit {
  @Input() public appointment_id: any;
  @Input() showEPrescription: boolean;

  public authUser: any;
  public loading: boolean = false;
  reports: any = [];
  type = 1;
  options: "";

  public fileUploadControl = new FileUploadControl(
    FileUploadValidators.filesLimit(2)
  );
  public uploadedFiles: Array<any> = [];
  public uploadedFile: any;

  constructor(
    public activeModal: NgbActiveModal,
    private _consultationsSErvice: ConsultationsService,
    private helperService: HelperService,
    private authService: AuthService,
    private _toastr: ToastrService,
    private _modalService: NgbModal
  ) {}
  private unsubscribe: Subject<any> = new Subject();

  ngOnInit(): void {
    this.authUser = this.authService.getAuthUser();
  }

  close(uploadFiles?: any[]) {
    this.activeModal.close(uploadFiles);
  }

  files: File[] = [];

  onSelectPDF() {
    // this.reports.push(this.uploadedFile[0]);
    // this.uploadedFiles.push(this.uploadedFile);
    // this.files.push(this.uploadedFile);
    if (this.uploadedFile.length > 3) {
      this.uploadedFile.length = 3;
    }
    this.uploadedFile.forEach((e) => {
      this.readFile(e).then((fileContents) => {
        // Put this string in a request body to upload it to an API.
        this.reports.push(fileContents);
      });
    });
  }

  onSelect(event) {
    this.files.push(...event.addedFiles);
    if (this.files.length > 3) {
      this.files.length = 3;
    }
    this.files.forEach((e) => {
      this.readFile(e).then((fileContents) => {
        // Put this string in a request body to upload it to an API.
        this.reports.push(fileContents);
      });
    });
  }

  onRemovePDF(file: any) {
    let index = this.reports.findIndex((x) => x === file);
    this.reports.splice(index, 1);
    // this.readFile(file).then(fileContents => {
    //   // Put this string in a request body to upload it to an API.
    //   this.reports.forEach(element => {
    //     if (element === fileContents) {
    //       this.reports.splice(this.files.indexOf(fileContents[0]), 1);
    //       this.files.splice(this.files.indexOf(fileContents[0]), 1);
    //       console.log(this.reports);
    //     }
    //   });
    // });
  }
  onRemove(event) {
    this.reports = [];
    this.files.splice(this.files.indexOf(event), 1);
    this.readFile(this.files[0]).then((fileContents) => {
      this.reports.push(fileContents);
    });
  }

  submit() {
    if (!this.reports.length) {
      this._toastr.error("Please select file", "Error");
      return;
    }
    this.loading = true;
    const user_id = this.authUser.id;
    if (this.reports.length > 3) {
      this.reports.length = 3;
    }
    const params = {
      prescriptions: this.reports,
      device_type: "web",
    };
    this._consultationsSErvice
      .uploadFiles(user_id, this.appointment_id, params)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (successResponse: any) => {
          this.loading = false;
          this.helperService.showToast(successResponse.message, "success");
          this.close(successResponse.data);
        },
        (errorResponse: any) => {
          this.loading = false;
          console.log(errorResponse);
        }
      );
  }

  private async readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = (e) => {
        console.error(`FileReader failed on file ${file.name}.`);
        return reject(null);
      };

      if (!file) {
        console.error("No file to read.");
        return reject(null);
      }

      reader.readAsDataURL(file);
    });
  }

  openPrescriptionModal() {
    const modalRef = this._modalService.open(AddPrescriptionModalComponent, {
      size: "lg",
    });
    modalRef.result.then((result) => {
      if (result) {
        this.activeModal.close(true);
      }
    });
    modalRef.componentInstance.title = "Prescription";
    modalRef.componentInstance.data = null;
    modalRef.componentInstance.appointmentId = this.appointment_id;
  }
}
