import { Injectable } from "@angular/core";
import { baseApi } from "../constants/base.url";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PagesService {
  constructor(private _http: HttpClient) {}

  logout = () => {
    let url: string = "/logout";
    return this._http.delete(baseApi + url);
  };

  getDoctorProfile = () => {
    let url: string = "/doctor/profile";
    return this._http.get(baseApi + url);
  };

  contactUs = (params) => {
    let url: string = "/contactUs";
    return this._http.post(baseApi + url, params);
  }
}
