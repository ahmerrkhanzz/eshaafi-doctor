import { Injectable } from "@angular/core";
import { baseApi } from "../../constants/base.url";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ConsultationsService {
  constructor(private _http: HttpClient) {}

  getAppointments(id: number, isInstant: boolean, params, page?: number) {
    if (!page) {
      page = 1;
    }
    let url: string = isInstant
      ? `/doctor/${id}/instant/appointments?page=${page}`
      : `/doctor/${id}/appointments?page=${page}`;
    return this._http.post(baseApi + url, params);
  }

  getInstantAppointments(id: any, params, page?: number) {
    let url = `/doctor/${id}/instant/appointments?page=${page}`;
    return this._http.post(baseApi + url, params);
  }

  changeAppointmentStatus(user_id: any, id: any, params) {
    let url = `/doctor/${user_id}/appointment/${id}/status`;
    return this._http.post(baseApi + url, params);
  }

  uploadFiles(user_id: any, id: any, params) {
    let url = `/doctor/${user_id}/appointment/${id}/upload/prescription`;
    return this._http.post(baseApi + url, params);
  }

  savePrescription(id: number, params) {
    let url = `/doctor/appointment/${id}/prescription/store`;
    return this._http.post(baseApi + url, params);
  }

  updatePrescription(appointmentId: number, precriptionId: number, params) {
    let url = `/doctor/appointment/${appointmentId}/prescription/${precriptionId}/update`;
    return this._http.post(baseApi + url, params);
  }

  getPrescriptions(id: number) {
    let url = `/prescription/get/${id}`;
    return this._http.get(baseApi + url);
  }

  deletePrescription(appointmentId:number, prescriptionId: number) {
    let url = `/doctor/appointment/${appointmentId}/prescription/${prescriptionId}/delete`;
    return this._http.delete(baseApi + url);
  }
}
