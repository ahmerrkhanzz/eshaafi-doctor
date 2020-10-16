import { Injectable } from "@angular/core";
import { baseApi } from "../constants/base.url";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class VideoCallingService {
  constructor(private _http: HttpClient) {}

  makeCall(id: any, appointment_id: any) {
    let url = `/doctor/${id}/appointment/${appointment_id}/call`;
    return this._http.post(baseApi + url, { device_type: "web" });
  }

  callSync(status: any, channelName: any) {
    let url = `/patient/call/sync/${channelName}`;
    return this._http.post(baseApi + url, {
      status: status,
      device_type: "web",
    });
  }

  sendNotification(recieverId: number) {
    let url = `/send/notification/${recieverId}`;
    return this._http.get(baseApi + url);
  }
}
