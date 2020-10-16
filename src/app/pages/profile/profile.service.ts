import { Injectable } from "@angular/core";
import { baseApi } from "../../constants/base.url";
import { HttpClient } from "@angular/common/http";
import { Profile } from "./profile.model";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private _http: HttpClient) {}

  public loggedInUser = new BehaviorSubject<any>(null);

  getDoctorProfile = () => {
    let url: string = "/doctor/profile";
    return this._http.get(baseApi + url);
  };

  updateDoctorProfile = (params) => {
    let url: string = "/doctor/profile/update";
    return this._http.post(baseApi + url, params);
  };

  getSpecialities = () => {
    let url: string = "/doctor/specialities";
    return this._http.get(baseApi + url);
  };
}
