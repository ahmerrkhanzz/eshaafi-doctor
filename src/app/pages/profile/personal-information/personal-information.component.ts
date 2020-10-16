import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
  textValidator,
  numericValidator,
  removeDuplicates,
} from "src/app/shared/globalfunctions";
import { ProfileService } from "../profile.service";

@Component({
  selector: "app-personal-information",
  templateUrl: "./personal-information.component.html",
  styleUrls: ["./personal-information.component.scss"],
})
export class PersonalInformationComponent implements OnInit {
  @Input() savedForm: any;
  @Output() unauthorized = new EventEmitter<boolean>(false);
  @Output() proceed = new EventEmitter<object>(null);
  @ViewChild("avatar") avatar: ElementRef;

  public loading: boolean = false;
  public languages = [];
  public specialities: any[] = [];
  public selectedItems = [];
  public dropdownSettings = {};
  public profileImg: File;
  public dob: any;
  public preview: string =
    "../../../../../assets/images/doctor-placeholder.jpg";
  public personalInformationForm: FormGroup;
  public textValidator = textValidator;
  public numericValidator = numericValidator;
  public selectedDoctor: any;
  public selectedLanguages: any[] = [];
  public selectedSpecialities: any[] = [
    {
      id: null,
      name: "General Phsycian",
      file: null,
    },
  ];
  public minDate = { year: 1900, month: 1, day: 1 };
  maxDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };

  // formatter = (cities: City) => cities.name;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _toast: ToastrService,
    private _profileService: ProfileService
  ) {}

  ngOnInit() {
    this.languages = [
      { id: 1, name: "English" },
      { id: 2, name: "Urdu" },
      { id: 3, name: "Turkish" },
      { id: 4, name: "German" },
      { id: 5, name: "Arabic" },
      { id: 6, name: "Spanish" },
      { id: 7, name: "Portugeese" },
    ];

    this.selectedItems = [
      { id: 3, name: "Pune" },
      { id: 4, name: "Navsari" },
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: "id",
      textField: "name",
      selectAllText: "Select All",
      unSelectAllText: "UnSelect All",
      itemsShowLimit: 4,
      allowSearchFilter: true,
    };

    this.personalInformationForm = this.formBuilder.group({
      image: [null, Validators.required],
      pmdc: [
        "",
        [
          Validators.required,
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      name: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      phone: [
        "",
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.maxLength(10),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      date_of_birth: [""],
      country: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(25),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      city: [
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(25),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      address: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(40),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
      language: ["", Validators.required],
      speciality: ["", Validators.required],
      gender: ["", Validators.required],
      is_instant: [true, Validators.required],
      summary: [
        "",
        [
          Validators.required,
          Validators.minLength(20),
          Validators.pattern(/^\S$|^\S[\s\S](?!.* {2})[\s\S]*\S$/),
        ],
      ],
    });

    this.getSpecialities();
    this._profileService.loggedInUser.subscribe((res) => {
      if (res) {
        this.selectedDoctor = res;
        this.patchFormValues(this.selectedDoctor);
      }
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  /**
   *
   * Getter method for form controls values
   * @readonly
   * @type {object}
   * @memberof PersonalInformationComponent
   */
  get personalInformationFormControls(): any {
    return this.personalInformationForm["controls"];
  }

  /**
   *
   *  On Single Item Selection of Multi Select Dropdown
   * @param {object} item
   * @memberof PersonalInformationComponent
   */
  onItemSelect(item: any) {}

  /**
   *
   * On Selection of all options in multi select dropdown
   * @param {object} items array of selected items
   * @memberof PersonalInformationComponent
   */
  onSelectAll(items: any) {}

  /**
   * Gender Selection
   *
   * @param {object} event gender object
   * @memberof PersonalInformationComponent
   */
  changeInstant(event) {
    if (this.personalInformationForm.value.is_instant) {
      this.selectedSpecialities = [
        {
          id: null,
          name: "General Phsycian",
          file: null,
        },
      ];
      this.personalInformationForm.get("speciality").clearValidators();
      this.personalInformationForm.get("speciality").updateValueAndValidity();
    } else {
      this.selectedSpecialities = [];
      this.personalInformationForm
        .get("speciality")
        .setValidators([Validators.required]);
      this.personalInformationForm.get("speciality").updateValueAndValidity();
    }
  }

  /**
   *
   * Image Upload Handler
   * @param {object} event added image object info
   * @memberof PersonalInformationComponent
   */
  handleFileInput(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const fileName = event.target.files[0].name;
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.personalInformationForm.patchValue({
          image: reader.result,
        });
        this.personalInformationForm.get("image").updateValueAndValidity();
        this.preview = reader.result as string;
      };
    }
    event.target.value = null;
  }

  getSpecialities() {
    this._profileService.getSpecialities().subscribe(
      (res: any) => {
        this.specialities = res.data;
      },
      (err: any) => {
        if (err && err.status === 401) {
          localStorage.removeItem("token");
          this._toast.error("Token Expired", "Error");
          this.unauthorized.emit(true);
        }
      }
    );
  }

  cancelAvatar() {
    if (localStorage.hasOwnProperty("selectedDoctor")) {
      this.preview = this.selectedDoctor.image;
      this.personalInformationForm.patchValue({
        image: "",
      });
      this.personalInformationForm.get("image").clearValidators();
      this.personalInformationForm.get("image").updateValueAndValidity();
    } else {
      this.preview = "../../../../../assets/images/doctor-placeholder.jpg";
    }
  }

  setInputFilter(
    textbox: Element,
    inputFilter: (value: string) => boolean
  ): void {
    [
      "input",
      "keydown",
      "keyup",
      "mousedown",
      "mouseup",
      "select",
      "contextmenu",
      "drop",
    ].forEach(function (event) {
      textbox.addEventListener(event, function (
        this: (HTMLInputElement | HTMLTextAreaElement) & {
          oldValue: string;
          oldSelectionStart: number | null;
          oldSelectionEnd: number | null;
        }
      ) {
        if (inputFilter(this.value)) {
          this.oldValue = this.value;
          this.oldSelectionStart = this.selectionStart;
          this.oldSelectionEnd = this.selectionEnd;
        } else if (Object.prototype.hasOwnProperty.call(this, "oldValue")) {
          this.value = this.oldValue;
          if (
            this.oldSelectionStart !== null &&
            this.oldSelectionEnd !== null
          ) {
            this.setSelectionRange(
              this.oldSelectionStart,
              this.oldSelectionEnd
            );
          }
        } else {
          this.value = "";
        }
      });
    });
  }

  patchFormValues(data) {
    const {
      image,
      pmdc,
      name,
      email,
      phone,
      date_of_birth,
      country,
      city,
      address,
      gender,
      speciality,
      language,
      summary,
      is_instant,
    } = data;
    if (date_of_birth) {
      let date = new Date(date_of_birth);
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let day = date.getDate();
      this.dob = {
        year: year,
        month: month,
        day: day,
      };
    }
    this.preview = image.includes("no-image")
      ? "../../../../../assets/images/doctor-placeholder.jpg"
      : image;
    if (!is_instant) {
      this.selectedSpecialities = speciality;
    }
    this.personalInformationForm.patchValue({
      image: "",
      pmdc: pmdc,
      name: name,
      email: email,
      phone: phone,
      date_of_birth:
        date_of_birth && typeof date_of_birth === "string"
          ? this.dob
          : date_of_birth,
      country: country,
      city: city,
      address: address,
      is_instant: is_instant,
      gender: gender,
      speciality: this.selectedSpecialities,
      language: removeDuplicates(language, "name"),
      summary: summary,
    });
    this.languages.forEach((e) => {
      language.forEach((element) => {
        if (e.name === element.name) {
          this.selectedLanguages.push(e);
        }
      });
    });
    this.personalInformationForm.get("password").clearValidators();
    this.personalInformationForm.get("password").updateValueAndValidity();
    this.personalInformationForm.get("image").clearValidators();
    this.personalInformationForm.get("image").updateValueAndValidity();
  }

  arrayFormatter(array, type) {
    if (type === "id") {
      return array.map((obj) => {
        return obj.id;
      });
    } else if (type === "name") {
      return array.map((obj) => {
        return obj.name;
      });
    } else {
      return array.map((obj) => {
        return obj.service;
      });
    }
  }

  updateForm() {
    this.loading = true;
    const {
      image,
      name,
      email,
      phone,
      city,
      country,
      address,
      pmdc,
      summary,
      language,
      speciality,
      gender,
      date_of_birth,
      is_instant,
    } = this.personalInformationForm.value;
    const params = {
      personal_information: true,
      profile_image: image,
      name: name,
      email: email,
      phone: phone,
      city: city,
      country: country,
      address: address,
      pmdc: pmdc,
      summary: summary,
      is_instant: is_instant,

      language: this.arrayFormatter(removeDuplicates(language, "name"), "name"),
      speciality: is_instant ? null : speciality,
      gender: gender,
      date_of_birth: date_of_birth,
    };

    this.selectedDoctor.image = this.preview;
    this.selectedDoctor.name = name;
    this.selectedDoctor.email = email;
    this.selectedDoctor.phone = phone;

    this.selectedDoctor.city = city;
    this.selectedDoctor.country = country;
    this.selectedDoctor.address = address;
    this.selectedDoctor.gender = gender;
    this.selectedDoctor.speciality = speciality;
    this.selectedDoctor.language = removeDuplicates(language, "name");
    this.selectedDoctor.pmdc = pmdc;
    this.selectedDoctor.summary = summary;
    this.selectedDoctor.is_instant = is_instant;
    this.selectedDoctor.date_of_birth =
      date_of_birth.year.toString() +
      "-" +
      date_of_birth.month.toString() +
      "-" +
      date_of_birth.day.toString();

      this._profileService.updateDoctorProfile(params).subscribe(
      (res: any) => {
        this.loading = false;
        this._toast.success(
          "Personal information updated successfully",
          "Success"
        );
        this._profileService.loggedInUser.next(this.selectedDoctor);
      },
      (err: any) => {
        this.loading = false;
        this._toast.error(err.error.message, "Error");
      }
    );
  }
}
