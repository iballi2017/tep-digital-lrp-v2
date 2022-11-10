import { NgRedux, select } from '@angular-redux/store';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LocationService } from 'src/app/services/location.service';
import { OccupantService } from 'src/app/services/occupant.service';
import { IAppState } from 'src/redux/store';
import {
  ADD_OCCUPANT,
  ADD_OCCUPANT_ERROR,
  ADD_OCCUPANT_SUCCESS,
} from 'src/redux/_occupant.store/occupant.actions';

@Component({
  selector: 'app-add-respondent',
  templateUrl: './add-respondent.component.html',
  styleUrls: ['./add-respondent.component.scss'],
})
export class AddRespondentComponent implements OnInit, OnDestroy {
  @select((s) => s.occupantsList.isLoading) isLoading$:any;
  submitBtnLabel = "Add Respondent";
  nigerianStateList!: string[];
  num: number = 7;
  agesList: number[] = [];
  AddRespondentForm!: FormGroup;
  Subscriptions: Subscription[] = [];
  constructor(
    private _locationSvc: LocationService,
    private _fb: FormBuilder,
    private _occupantSvc: OccupantService,
    private ngRedux: NgRedux<IAppState>,
    public dialogRef: MatDialogRef<AddRespondentComponent>
  ) {}

  ngOnInit(): void {
    this.onGetNigerianStates();
    this.buildForm();
    let x: number = this.num;
    this.createNumberArray(x);
  }

  
  createNumberArray(d: number) {
    while (d < 12) {
      this.agesList.push(d);
      d++;
    }
  }


  buildForm() {
    this.AddRespondentForm = this._fb.group({
      FullName: ['', [Validators.required]],
      Gender: ['', [Validators.required]],
      Age: ['', [Validators.required]],
      Location: ['', [Validators.required]],
    });
  }

  onGetNigerianStates() {
    this.nigerianStateList = this._locationSvc.getNigerianStates();
  }

  onSubmit() {
    const Payload = {
      occ_name: this.AddRespondentForm.value.FullName,
      occ_state: this.AddRespondentForm.value.Location,
      occ_age: this.AddRespondentForm.value.Age,
      occ_gender: this.AddRespondentForm.value.Gender,
    };
    this.ngRedux.dispatch({ type: ADD_OCCUPANT });
    let subscription =   this._occupantSvc.AddOccupant(Payload).subscribe({
      next: (response: any) => {
        if (response) {
          this.ngRedux.dispatch({
            type: ADD_OCCUPANT_SUCCESS,
            payload: response,
          });
          this._occupantSvc.LoadOccupants();
          this.closeDialog();
        }
      },
      error: (err: any) => {
        console.warn('Error: ', err);
        this.ngRedux.dispatch({ type: ADD_OCCUPANT_ERROR, payload: err });
      },
    });
    this.Subscriptions.push(subscription);
  }

  closeDialog() {
    this.dialogRef.close('Form closed!');
  }


  ngOnDestroy(): void {
    this.Subscriptions.forEach((x) => {
      if (!x.closed) {
        x.unsubscribe();
      }
    });
  }
}
