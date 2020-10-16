import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import {
  AgoraClient,
  ClientEvent,
  NgxAgoraService,
  Stream,
  StreamEvent,
} from "ngx-agora";
import { VideoCallingService } from "./video-calling.service";
import { takeUntil } from "rxjs/operators";
import { HelperService } from "../services/helper.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { Subject, interval } from 'rxjs';

@Component({
  selector: "app-video-calling",
  templateUrl: "./video-calling.component.html",
  styleUrls: ["./video-calling.component.scss"],
})
export class VideoCallingComponent implements OnInit, OnDestroy {
  isVisible = true;
  show = false;
  mic_on = false;
  cam_on = false;
  title = "angular-video";
  localCallId = "agora_local";
  remoteCalls: string[] = [];
  patients: any[] = [
    {
      name: "Patient",
    },
  ];
  channelKey: any;
  channelName: any;
  isExpired: any;
  canCall: any;

  private client: AgoraClient;
  private localStream: Stream;
  private uid: any;

  constructor(
    private ngxAgoraService: NgxAgoraService,
    private videoCallingService: VideoCallingService,
    private helperService: HelperService,
    private authService: AuthService,
    private _router: Router,
    private changeDetector: ChangeDetectorRef
  ) {
    // this.uid = Math.floor(Math.random() * 100);
  }
  private unsubscribe: Subject<any> = new Subject();
  entries: any[] = [
    // { id: 'yesterday', created: new Date(new Date().getTime() - (24 * 1000 * 60 * 60) ) },
    // { id: '1 hour ago', created: new Date(new Date().getTime() - (1000 * 60 * 60) ) },
    // { id: '1 minute ago', created: new Date(new Date().getTime() - (1000 * 60) ) }
  ];
  newId: string;
  
  private destroyed$ = new Subject();

  ngOnInit() {
    if (localStorage.hasOwnProperty("appointment_id")) {
      const id = localStorage.getItem("appointment_id");
      const user = this.authService.getAuthUser();
      let user_id = user.id;
      this.uid = user_id;
      // this.uid = 0;
      this.loadCallCredentials(user.id, id);
    } else {
      this._router.navigate(["/online-consultation"]);
      return false;
    }

    this.newId = '';
    
    
    interval(1000).subscribe(() => {
      if (!this.changeDetector['destroyed']) {
        this.changeDetector.detectChanges();
      }
    });

    this.changeDetector.detectChanges();
  }

  ngOnDestroy() {
    localStorage.removeItem("appointment_id");
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  
  addEntry() {
    this.entries.push({
      created: new Date(),
      id: this.newId
    });
    this.newId = '';
  }

  getElapsedTime(entry: any) {        
    let totalSeconds = Math.floor((new Date().getTime() - entry.created.getTime()) / 1000);
    
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);      
      totalSeconds -= 3600 * hours;      
    }

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }

    seconds = totalSeconds;
    
    return {
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
  }

  public reciever_uid: number;
  loadCallCredentials(id: any, appointment_id: any) {
    this.videoCallingService
      .makeCall(id, appointment_id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (successResponse: any) => {
          const {
            agora_token,
            channel_name,
            is_expired,
            can_call,
            patient_user_id,
          } = successResponse.data;
          this.channelKey = agora_token;
          this.channelName = channel_name;
          this.isExpired = is_expired;
          this.canCall = can_call;
          this.reciever_uid = patient_user_id;

          if (this.isExpired === false && this.canCall === true) {
            console.log(this.isExpired + "can Call" + this.canCall);
            this.client = this.ngxAgoraService.createClient({
              mode: "rtc",
              codec: "h264",
            });
            this.assignClientHandlers();

            this.localStream = this.ngxAgoraService.createStream({
              streamID: this.uid,
              audio: true,
              video: true,
              screen: false,
            });
            this.assignLocalStreamHandlers();
            // Join and publish methods added in this step
            this.initLocalStream(() =>
              this.join(
                (user_id) => this.publish(),
                (error) => console.error(error)
              )
            );
          } else if (this.isExpired === false && this.canCall === false) {
            this.helperService.showToast("Too early", "error");
            this._router.navigate([`/consultation`]);
          } else {
            console.log("here");
            this.helperService.showToast("Time Expired", "error");
            this._router.navigate([`/consultation`]);
          }
        },
        (errorResponse: any) => {
          console.log(errorResponse);
        }
      );
  }

  callSync(status: any) {
    this.videoCallingService
      .callSync(status, this.channelName)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (successResponse: any) => {
          console.log(successResponse);
          this.channelKey = successResponse.data.agora_token;
          this.channelName = successResponse.data.channel_name;
          this.isExpired = successResponse.data.is_expired;
          this.canCall = successResponse.data.can_call;

          if (this.isExpired === false && this.canCall === true) {
            console.log(this.isExpired + "can Call" + this.canCall);
            this.client = this.ngxAgoraService.createClient({
              mode: "rtc",
              codec: "h264",
            });
            this.assignClientHandlers();

            this.localStream = this.ngxAgoraService.createStream({
              streamID: this.uid,
              audio: true,
              video: true,
              screen: false,
            });
            this.assignLocalStreamHandlers();
            // Join and publish methods added in this step
            this.initLocalStream(() =>
              this.join(
                (user_id) => this.publish(),
                (error) => console.error(error)
              )
            );
          } else if (this.isExpired === false && this.canCall === false) {
            this.helperService.showToast("Too early", "error");
            this._router.navigate([`/consultation`]);
          } else {
            this.helperService.showToast("Time Expired", "error");
            this._router.navigate([`/admin/online-consultation`]);
          }
        },
        (errorResponse: any) => {
          console.log(errorResponse);
        }
      );
  }

  /**
   * Attempts to connect to an online chat room where users can host and receive A/V streams.
   */
  join(
    onSuccess?: (uid: number | string) => void,
    onFailure?: (error: Error) => void
  ): void {
    this.client.join(null, this.channelName, this.uid, onSuccess, onFailure);
  }

  /**
   * Attempts to upload the created local A/V stream to a joined chat room.
   */
  publish(): void {
    this.client.publish(this.localStream, (err) =>
      console.log("Publish local stream error: " + err)
    );
  }

  private assignClientHandlers(): void {
    this.client.on(ClientEvent.LocalStreamPublished, (evt) => {
      console.log("Publish local stream successfully");
    });

    this.client.on(ClientEvent.Error, (error) => {
      console.log("Got error msg:", error.reason);
      if (error.reason === "DYNAMIC_KEY_TIMEOUT") {
        this.client.renewChannelKey(
          "",
          () => console.log("Renewed the channel key successfully."),
          (renewError) =>
            console.error("Renew channel key failed: ", renewError)
        );
      }
    });

    this.client.on(ClientEvent.RemoteStreamAdded, (evt) => {
      this.isVisible = false;
      const stream = evt.stream as Stream;
      this.client.subscribe(stream, { audio: true, video: true,}, (err) => {
        console.log("Subscribe stream failed", err);
      });
      this.addEntry()
    });

    this.client.on(ClientEvent.RemoteStreamSubscribed, (evt) => {
      const stream = evt.stream as Stream;
      const id = this.getRemoteId(stream);
      if (!this.remoteCalls.length) {
        this.remoteCalls.push(id);
        setTimeout(() => stream.play(id), 1000);
      }
    });

    this.client.on(ClientEvent.RemoteStreamRemoved, (evt) => {
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.remoteCalls = [];
        console.log(`Remote stream is removed ${stream.getId()}`);
      }
    });

    this.client.on(ClientEvent.PeerLeave, (evt) => {
      this.isVisible = true;
      const stream = evt.stream as Stream;
      if (stream) {
        stream.stop();
        this.callEnd();
        this.remoteCalls = this.remoteCalls.filter(
          (call) => call !== `${this.getRemoteId(stream)}`
        );
        // HERE CALL ENDED.

        console.log(`${evt.uid} left from this channel`);
      }
    });
  }

  private assignLocalStreamHandlers(): void {
    this.localStream.on(StreamEvent.MediaAccessAllowed, () => {
      console.log("accessAllowed");
    });

    // The user has denied access to the camera and mic.
    this.localStream.on(StreamEvent.MediaAccessDenied, () => {
      console.log("accessDenied");
    });
  }

  private initLocalStream(onSuccess?: () => any): void {
    this.localStream.init(
      () => {
        // The user has granted access to the camera and mic.
        this.localStream.play(this.localCallId);
        if (onSuccess) {
          onSuccess();
        }
      },
      (err) => console.error("getUserMedia failed", err)
    );
  }

  private getRemoteId(stream: Stream): string {
    return `agora_remote-${stream.getId()}`;
  }
  callEnd() {
    // window.location.href="https://eshaafi.com/";
    this.videoCallingService.sendNotification(this.reciever_uid).subscribe(
      (res: any) => {
        console.log(res);
      },
      (err: any) => {
        console.log(err);
      }
    );
    
    this.client.leave(
      function () {
        console.log("client leaves channel");
        
        //……
      },
      function (err) {
        console.log("client leave failed ", err);
        //error handling
      }
    );
    this.client.disableDualStream(
      function () {
        console.log("Disable dual stream success!");
      },
      function (err) {
        console.log(err);
      }
    );
    this._router.navigate(["/online-consultation"]);
  }

  audioCall() {
    if (this.mic_on === false) {
      this.mic_on = true;
      this.localStream.disableAudio();
    } else {
      this.mic_on = false;
      this.localStream.enableAudio();
    }
  }

  videoCall() {
    if (this.cam_on === false) {
      this.cam_on = true;
      this.localStream.disableVideo();
    } else {
      this.cam_on = false;
      this.localStream.enableVideo();
    }
  }
}
