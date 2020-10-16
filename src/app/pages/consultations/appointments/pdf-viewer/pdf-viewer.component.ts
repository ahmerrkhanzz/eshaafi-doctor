import { Component, Input, OnInit } from "@angular/core";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

@Component({
  selector: "app-pdf-viewer",
  templateUrl: "./pdf-viewer.component.html",
  styleUrls: ["./pdf-viewer.component.scss"],
})
export class PdfViewerComponent implements OnInit {
  @Input() data: any;
  constructor() {}

  ngOnInit(): void {
    console.log(this.data);
    
  }

  generatePDF() {
    let data = document.getElementById("contentToConvert");
    html2canvas(data).then((canvas) => {
      var imgWidth = 208;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jsPDF("p", "mm", "a4");
      var position = 0;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save(`e-Prescription-${this.data.id}.pdf`);
    });
  }
}
