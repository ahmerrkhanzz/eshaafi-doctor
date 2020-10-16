import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-timeline-view",
  templateUrl: "./timeline-view.component.html",
  styleUrls: ["./timeline-view.component.scss"],
})
export class TimelineViewComponent implements OnInit {
  @Input() item: any;
  @Output("editEmitter") editEmitter = new EventEmitter<number>(null);
  constructor() {}

  ngOnInit(): void {}

  convertDate(date) {
    return moment(date).format("ll");
  }

  editItem(id) {
    this.editEmitter.emit(id);
  }
}
