import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import {
  numericValidator,
  textValidator,
} from "src/app/shared/globalfunctions";
import { ConsultationsService } from "../../consultations.service";

@Component({
  selector: "app-add-prescription-modal",
  templateUrl: "./add-prescription-modal.component.html",
  styleUrls: ["./add-prescription-modal.component.scss"],
})
export class AddPrescriptionModalComponent implements OnInit {
  @Input() appointmentId: number;
  @Input() data: any;
  public ePrescriptionForm: FormGroup;
  public generalMedicineForm: FormGroup;
  public textValidator = textValidator;
  public numericValidator = numericValidator;
  public loading: boolean = false;
  constructor(
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private _consultationService: ConsultationsService,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.ePrescriptionForm = this.formBuilder.group({
      id: [null],
      notes: ["", [Validators.required]],
      remarks: ["", [Validators.required]],
      general_medicines: this.formBuilder.array([this.initGeneralMedicine()]),
      lab_tests: this.formBuilder.array([this.initLabTests()]),
    });
    console.log(this.data);
    if (this.data) {
      this.patchFormValues(this.data);
    }
  }

  initGeneralMedicine() {
    return this.formBuilder.group({
      name: ["", [Validators.required]],
      morning: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(3)],
      ],
      afternoon: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(3)],
      ],
      evening: [
        "",
        [Validators.required, Validators.minLength(1), Validators.maxLength(3)],
      ],
      instructions: ["", [Validators.required]],
      duration: ["", [Validators.required]],
    });
  }

  updateGeneralMedicine(object) {
    const {
      id,
      name,
      morning,
      afternoon,
      evening,
      instructions,
      duration,
    } = object;
    console.log(morning);
    return this.formBuilder.group({
      id: [object.id],
      name: [name, [Validators.required]],
      morning: [
        morning,
        [Validators.required, Validators.minLength(1), Validators.maxLength(3)],
      ],
      afternoon: [
        afternoon,
        [Validators.required, Validators.minLength(1), Validators.maxLength(3)],
      ],
      evening: [
        evening,
        [Validators.required, Validators.minLength(1), Validators.maxLength(3)],
      ],
      instructions: [instructions, [Validators.required]],
      duration: [duration, [Validators.required]],
    });
  }

  initLabTests() {
    return this.formBuilder.group({
      name: ["", [Validators.required]],
      instructions: ["", [Validators.required]],
    });
  }

  updateLabTests(object) {
    const { id, name, instructions } = object;
    return this.formBuilder.group({
      id: [id],
      name: [name, [Validators.required]],
      instructions: [instructions, [Validators.required]],
    });
  }

  /**
   *
   * Getter method for form controls values
   * @readonly
   * @type {object}
   * @memberof ExperienceComponent
   */
  getFormControls(index) {
    return this.ePrescriptionForm["controls"].controls;
  }

  addAnother() {
    const control = <FormArray>(
      this.ePrescriptionForm.controls["general_medicines"]
    );
    control.push(this.initGeneralMedicine());
  }

  removeAnother() {
    const control = <FormArray>(
      this.ePrescriptionForm.controls["general_medicines"]
    );
    control.removeAt(control.length - 1);
  }

  close(value?: boolean) {
    this.activeModal.close(value);
  }

  submit() {
    console.log(this.ePrescriptionForm);
    this.loading = true;
    const params = {};
    if (this.data) {
      this._consultationService
        .updatePrescription(
          this.appointmentId,
          this.data.id,
          this.ePrescriptionForm.value
        )
        .subscribe(
          (e) => {
            console.log(e);
            this.loading = false;
            this.activeModal.close(true);
            this._toastr.success('E Prescription updated successfully')
          },
          (err: any) => {
            console.log(err);
            this.loading = false;
          }
        );
    } else {
      this._consultationService
        .savePrescription(this.appointmentId, this.ePrescriptionForm.value)
        .subscribe(
          (e) => {
            console.log(e);
            this.loading = false;
            this.activeModal.close(true);
            this._toastr.success('E Prescription added successfully')
          },
          (err: any) => {
            console.log(err);
            this.loading = false;
          }
        );
    }
  }

  delete() {
    this.loading = true;
    this._consultationService.deletePrescription(this.appointmentId, this.data.id).subscribe(
      (e) => {
        this.loading = false;
        this.activeModal.close(true);
        this._toastr.success('E Prescription deleted successfully')
      },
      (err: any) => {
        this.loading = false;
      }
    );
  }

  patchFormValues(data) {
    const { note, remarks } = data;
    let control = <FormArray>(
      this.ePrescriptionForm.controls["general_medicines"]
    );
    let control2 = <FormArray>this.ePrescriptionForm.controls["lab_tests"];
    data.medicines.forEach((element) => {
      const {
        dose: { morning, afternoon, evening },
        duration,
        instructions,
        name,
        id,
      } = element;
      let obj = {
        id,
        morning,
        afternoon,
        evening,
        duration,
        name,
        instructions,
      };
      console.log(obj);
      control.push(this.updateGeneralMedicine(obj));
    });
    data.lab_tests.forEach((element) => {
      const { instructions, name, id } = element;
      let obj = {
        id,
        name,
        instructions,
      };
      console.log(obj);
      control2.push(this.updateLabTests(obj));
    });
    control.removeAt(0);
    control2.removeAt(0);
    this.ePrescriptionForm.patchValue({
      id: this.data.id,
      notes: note,
      remarks: remarks,
    });
  }
}
