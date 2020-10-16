import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { PagesService } from "../pages.service";
import { ProfileService } from "../profile/profile.service";

@Component({
  selector: "app-admin-aside",
  templateUrl: "./admin-aside.component.html",
  styleUrls: ["./admin-aside.component.scss"],
})
export class AdminAsideComponent implements OnInit {
  public selectedChild: any = null;
  public navList = [
    {
      name: "Dashboard",
      icon: "fab fa-buffer",
      routeName: "dashboard",
    },
    {
      name: "My Profile",
      icon: "fa fa-user",
      routeName: "profile",
    },
    {
      name: "Online Consultations",
      icon: "fa fa-user",
      routeName: "online-consultation",
    },
    {
      name: "My Patients",
      icon: "fa fa-user",
      routeName: "patients",
    },
    {
      name: "Logout",
      icon: "fas fa-sign-out-alt",
      routeName: "logout",
    },
  ];
  constructor(
    private _router: Router,
    private _pagesService: PagesService,
    private _profileService: ProfileService
  ) {
    this._router.events.subscribe((val: NavigationEnd) => {
      if (val.hasOwnProperty("url")) {
        if (val.url === "/profile") {
          this.selectedChild = this.navList[1];
        } else if (val.url === "/dashboard") {
          this.selectedChild = this.navList[0];
        } else if (val.url === "/online-consultation") {
          this.selectedChild = this.navList[2];
        } else if (val.url === "/patients") {
          this.selectedChild = this.navList[3];
        }
      }
    });
  }

  ngOnInit(): void {
    if (localStorage.hasOwnProperty("authUser")) {
      const userInfo = JSON.parse(localStorage.getItem("authUser"));
      if (userInfo.is_instant) {
        this.navList[2].name = "Instant Appointments";
      }
    }
  }

  tabClick(comp) {
    this.selectedChild = comp;
    if (comp.routeName === "logout") {
      this._pagesService.logout().subscribe(
        (res: any) => {
          console.log(res);
          this._router.navigate([`/`]);
          localStorage.clear();
          this._profileService.loggedInUser.next(null);
        },
        (err: any) => {
          console.log(err);
        }
      );
    } else {
      this._router.navigate([`/${comp.routeName.toLowerCase()}`]);
    }
  }
}
