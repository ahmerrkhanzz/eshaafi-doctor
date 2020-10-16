import { Component, OnInit } from "@angular/core";
import { PatientsService } from "./patients.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-patients",
  templateUrl: "./patients.component.html",
  styleUrls: ["./patients.component.scss"],
})
export class PatientsComponent implements OnInit {
  public loading: boolean = false;
  public tableConstructor = {
    headers: [
      "Name",
      "Phone",
      "Blood Group",
      "Gender",
      "City",
      "Height",
      "Weight",
      "Maritial Status",
    ],
    rows: [],
    table: "Patients",
    showActions: false,
    showCheckboxes: false,
  };
  constructor(
    private _patientsService: PatientsService,
    private _toast: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.tableConstructor);
    const userInfo = JSON.parse(localStorage.getItem("authUser"));
    this.getDoctorPatients(userInfo.id);
  }

  actionEmitter(event) {
    console.log(event);
  }

  editEmitter(event) {
    console.log(event);
  }

  getDoctorPatients(id: number) {
    this.loading = true;
    const params = {
      device_type: "web",
    };
    this._patientsService.getDoctorPatients(id, params).subscribe(
      (res: any) => {
        this.loading = false;
        this.tableConstructor.rows = res.data;
        console.log(res);
      },
      (err: any) => {
        this.loading = false;
        this._toast.error(err.error.message, "Error");
      }
    );
  }

  pageChangeHandler(event) {
    this.getDoctorPatients(event);
  }
}
