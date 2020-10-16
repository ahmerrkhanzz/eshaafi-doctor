import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";
import "rxjs/add/operator/do";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private _toast: ToastrService, private _router: Router) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let accessTOken = "";
    if (localStorage.hasOwnProperty("authUser")) {
      const userInfo = JSON.parse(localStorage.getItem("authUser"));
      accessTOken = userInfo.token;
    }

    return next
      .handle(
        httpRequest.clone({
          setHeaders: {
            Authorization: "Bearer " + accessTOken,
            "Content-Type": "application/json;charset=UTF-8",
            Accept: "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "Sat, 01 Jan 2000 00:00:00 GMT",
            "X-Frame-Options": "DENY",
            "Content-Security-Policy": "base-uri 'self'",
            "If-Modified-Since": "0",
          },
        })
      )
      .do(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this._router.navigate(["/"]);
              localStorage.clear();
              // redirect to the login route
              // or show a modal
            }
          }
        }
      );
  }
}
