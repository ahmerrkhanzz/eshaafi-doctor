import { Injectable } from "@angular/core";
import { baseApi } from "../../constants/base.url";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PatientsService {
  constructor(private _http: HttpClient) {}

  getDoctorPatients = (id: number, params) => {
    let url: string = `/doctor/${id}/appointments/patients`;
    return this._http.post(baseApi + url, params);
  };
}
