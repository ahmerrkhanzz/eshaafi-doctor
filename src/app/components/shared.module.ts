import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NguCarouselModule } from "@ngu/carousel";
import { TimelineViewComponent } from "./timeline-view/timeline-view.component";
import { CustomTableComponent } from "./custom-table/custom-table.component";

@NgModule({
  declarations: [TimelineViewComponent, CustomTableComponent],
  imports: [CommonModule, NgbModule, FormsModule, NguCarouselModule],
  exports: [TimelineViewComponent, CustomTableComponent],
  entryComponents: [],
})
export class SharedModule {}
