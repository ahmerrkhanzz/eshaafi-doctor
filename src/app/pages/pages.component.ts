import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { PagesService } from "./pages.service";
import { ProfileService } from "./profile/profile.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-pages",
  templateUrl: "./pages.component.html",
  styleUrls: ["./pages.component.scss"],
})
export class PagesComponent implements OnInit {
  public show: boolean = false;
  public loading: boolean = false;
  constructor(
    private _pagesService: PagesService,
    private _profileService: ProfileService,
    private _router: Router,
    private _toast: ToastrService
  ) {}

  ngOnInit(): void {
    if (!localStorage.hasOwnProperty("authUser")) {
      this._router.navigate(["/"]);
    }
    this.getDoctorProfile();
  }

  getDoctorProfile = () => {
    // this.loading = true;
    // this._pagesService.getDoctorProfile().subscribe(
    //   (res: any) => {
    //     this.loading = false;
    //     console.log(res);
    //     localStorage.setItem("selectedDoctor", JSON.stringify(res.data));
    //   },
    //   (err: any) => {
    //     this.loading = false;
    //     this._toast.error(err.error.message, "Error");
    //   }
    // );
  };

  logOut() {
    this.loading = true;
    this._pagesService.logout().subscribe(
      (res: any) => {
        this.loading = false;
        console.log(res);
        this._router.navigate([`/`]);
        localStorage.clear();
        this._profileService.loggedInUser.next(null);
        this._toast.success("Logged out successfully", "Success");
      },
      (err: any) => {
        this.loading = false;
        console.log(err);
      }
    );
  }
}
