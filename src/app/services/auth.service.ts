import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { baseApi } from "../constants/base.url";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  hostUri = baseApi;
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private toast: ToastrService
  ) {}

  public isLoggedInSubject = new BehaviorSubject<boolean>(
    this.checkIfLoggedIn()
  );
  public loginUserSubject = new BehaviorSubject<string>(this.getAuthUser());

  getAuthUser() {
    return JSON.parse(localStorage.getItem("authUser"));
  }

  setAuthUser(userDetails: any) {
    localStorage.setItem("authUser", JSON.stringify(userDetails));
    localStorage.setItem(
      "username",
      JSON.stringify(userDetails.serviceStaffID)
    );
    localStorage.setItem("userType", JSON.stringify(userDetails.userType));
    this.loginUserSubject.next(this.getAuthUser());
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem("authUser");
    this.loginUserSubject.next("");
    this.isLoggedInSubject.next(false);
    this.router.navigate(["/"]);
    this.toast.success("Logout sucessfully");
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  checkIfLoggedIn() {
    if (localStorage.getItem("authUser")) {
      return true;
    } else {
      return false;
    }
  }

  login(formData: any) {
    let headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    let endpoint: string;
    endpoint = "/login";
    const postedData = {
      user_name: formData.user_name,
      user_type: "doctor",
      device_type: "web",
      device_key: "web",
      password: formData.password,
    };
    return this.httpClient.post(`${this.hostUri + endpoint}`, postedData, {
      headers,
    });
  }
}
