import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-custom-table",
  templateUrl: "./custom-table.component.html",
  styleUrls: ["./custom-table.component.scss"],
})
export class CustomTableComponent implements OnInit {
  @Input() tableConstructor: any;
  @Output() actionEmitter = new EventEmitter<any>(null);
  @Output() editEmitter = new EventEmitter<any>(null);
  @Output() pageChange? = new EventEmitter<number>(null);

  public searchUser: any;
  public loading: boolean = false;
  // @Output() isAddDoctor = new EventEmitter<boolean>(false);
  public doctors: any[] = [];
  data: any[] = [
    {
      name: "Burk D'Agostini",
      email: "bdagostini1v@cmu.edu",
      joining: "8/29/2017",
      city: "Islamabad",
      country: "Pakistan",
      status: true,
      gender: "Female",
      speciality: "Allergists/Immunologists",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/13.jpg",
    },
    {
      name: "Eileen Spencock",
      email: "espencock3x@g.co",
      joining: "1/19/2017",
      city: "Multan",
      country: "Pakistan",
      status: true,
      gender: "Female",
      speciality: "Anesthesiologists",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/12.jpg",
    },
    {
      name: "Cooper Vooght",
      email: "cvooght34@weebly.com",
      joining: "2/12/2017",
      city: "Karachi",
      country: "Pakistan",
      status: false,
      gender: "Female",
      speciality: "Cardiologists",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/1.jpg",
    },
    {
      name: "Carlene Mussared",
      email: "cmussared3z@soundcloud.com",
      joining: "1/1/2017",
      city: "Islamabad",
      country: "Pakistan",
      status: true,
      gender: "Female",
      speciality: "Colon and Rectal Surgeons",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/15.jpg",
    },
    {
      name: "Burk D'Agostini",
      email: "bdagostini1v@cmu.edu",
      joining: "8/29/2017",
      city: "Islamabad",
      country: "Pakistan",
      status: true,
      gender: "Female",
      speciality: "Allergists/Immunologists",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/2.jpg",
    },
    {
      name: "Eileen Spencock",
      email: "espencock3x@g.co",
      joining: "1/19/2017",
      city: "Multan",
      country: "Pakistan",
      status: true,
      gender: "Female",
      speciality: "Anesthesiologists",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/3.jpg",
    },
    {
      name: "Cooper Vooght",
      email: "cvooght34@weebly.com",
      joining: "2/12/2017",
      city: "Lahore",
      country: "Pakistan",
      status: false,
      gender: "Female",
      speciality: "Cardiologists",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/4.jpg",
    },
    {
      name: "Carlene Mussared",
      email: "cmussared3z@soundcloud.com",
      joining: "1/1/2017",
      city: "Lahore",
      country: "Pakistan",
      status: true,
      gender: "Female",
      speciality: "Colon and Rectal Surgeons",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/5.jpg",
    },
    {
      name: "Burk D'Agostini",
      email: "bdagostini1v@cmu.edu",
      joining: "8/29/2017",
      city: "Peshawar",
      country: "Pakistan",
      status: true,
      gender: "Female",
      speciality: "Allergists/Immunologists",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/6.jpg",
    },
    {
      name: "Eileen Spencock",
      email: "espencock3x@g.co",
      joining: "1/19/2017",
      city: "Rawalpindi",
      country: "Pakistan",
      status: true,
      gender: "Female",
      speciality: "Anesthesiologists",
      phone: "+513225866369",
      img: "../../../../assets/images/doctors/7.jpg",
    },
    // {
    //   name: "Cooper Vooght",
    //   email: 'cvooght34@weebly.com',
    //   joining: '2/12/2017',
    //   city: 'Gujrat',
    //   country: 'Pakistan',
    //   status: false,
    //   gender: 'Female',
    //   speciality: 'Cardiologists',
    //   phone: '+513225866369',
    //   img: '../../../../assets/images/doctors/9.jpg'
    // },
    // {
    //   name: "Carlene Mussared",
    //   email: 'cmussared3z@soundcloud.com',
    //   joining: '1/1/2017',
    //   city: 'Islamabad',
    //   country: 'Pakistan',
    //   status: true,
    //   gender: 'Female',
    //   speciality: 'Colon and Rectal Surgeons',
    //   phone: '+513225866369',
    //   img: '../../../../assets/images/doctors/10.jpg'
    // },
  ];
  constructor() {} // private _confirmationDialogService: ConfirmationDialogueService

  ngOnInit(): void {
    console.log("her");

    console.log(this.tableConstructor);
  }

  openConfirmationDialog(item) {
    // this._confirmationDialogService
    //   .confirm(
    //     "",
    //     `Are you sure you want to delete ${item.name}?`,
    //     "Yes",
    //     "Cancel",
    //     "md"
    //   )
    //   .then((confirmed) => {
    //     if (confirmed) {
    //       this.actionEmitter.emit(item);
    //     }
    //   })
    //   .catch((err) => console.log(err));
  }

  editHandler(item) {
    this.editEmitter.emit(item);
  }

  pageChangeHandler(event) {
    this.pageChange.emit(event);
  }
}
