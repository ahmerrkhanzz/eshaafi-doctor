import { Injectable } from "@angular/core";
import { AuthenticatedApiService } from "src/app/services/authenticated-api.service";
import { baseApi } from "../../../constants/base.url";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class AppointmentService {
  // constructor(private apiService: AuthenticatedApiService) {}
  constructor(private _http: HttpClient) {}

  getAppointments(id: any, params) {
    let url = `/doctor/${id}/appointments`;
    return this._http.post(baseApi + url, params);
  }

  getInstantPendingAppointments(id: any) {
    let url = `/patient/${id}/instant/appointments/pending`;
    return this._http.post(baseApi + url, {
      device_type: "web",
    });
  }

  uploadFiles(user_id: any, id: any, payLoad: any) {
    let url = `/doctor/${user_id}/appointment/${id}/upload/prescription`;
    return this._http.post(baseApi + url, {
      prescriptions: payLoad.length > 3 ? payLoad.length === 3 : payLoad,
      device_type: "web",
    });
  }

  getAppointmentsList(id: any, page: any) {
    let url = `/doctor/${id}/appointments?page=${page}`;
    return this._http.post(baseApi + url, { device_type: "web" });
  }
}
