import { NgRedux } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { catchError, Subscription } from 'rxjs';
import { IAppState } from 'src/redux/store';
import {
  ADD_OCCUPANT,
  ADD_OCCUPANT_ERROR,
  ADD_OCCUPANT_SUCCESS,
  FETCH_OCCUPANTS_LIST,
  FETCH_OCCUPANTS_LIST_ERROR,
  FETCH_OCCUPANTS_LIST_SUCCESS,
  FETCH_SINGLE_OCCUPANT,
  FETCH_SINGLE_OCCUPANT_ERROR,
  FETCH_SINGLE_OCCUPANT_SUCCESS,
} from 'src/redux/_occupant.store/occupant.actions';
import { baseUrl } from '../config/api';
import { handleError } from '../helpers/errorHandler';

@Injectable({
  providedIn: 'root',
})
export class OccupantService implements OnDestroy {
  GetOccupantUrl = baseUrl + '/fetch-account-occupants';
  AddOccupantUrl = baseUrl + '/add-new-occupant';
  FetchOccupantUrl = baseUrl + '/fetch-occupant-by-id';
  RemoveOccupantUrl = baseUrl + '/delete-occupant';
  UpdateOccupantAccountUrl = baseUrl + '/update-occupant-account';
  Subscriptions: Subscription[] = [];

  constructor(private _http: HttpClient, private ngRedux: NgRedux<IAppState>) {}

  LoadOccupants() {
    this.ngRedux.dispatch({ type: FETCH_OCCUPANTS_LIST });
    this._http.get(this.GetOccupantUrl).subscribe({
      next: (response: any) => {
        if (response) {
          
          this.ngRedux.dispatch({
            type: FETCH_OCCUPANTS_LIST_SUCCESS,
            payload: response.data,
          });
        }
      },
      error: (err: any) => {
        console.warn('Error: ', err);
        this.ngRedux.dispatch({
          type: FETCH_OCCUPANTS_LIST_ERROR,
          payload: err,
        });
      },
    });
  }

  AddOccupant(Occupant: Occupant) {
    return this._http.post(this.AddOccupantUrl, Occupant);
  }

  FetchOccupantDetails(OccupantId: string) {
    this.ngRedux.dispatch({ type: FETCH_SINGLE_OCCUPANT });
    // return this._http.get(`${this.FetchOccupantUrl}/${OccupantId}`);
    let subscription =   this._http.get(`${this.FetchOccupantUrl}/${OccupantId}`).subscribe({
      next: (response: any) => {
        if (response) {
          
          this.ngRedux.dispatch({
            type: FETCH_SINGLE_OCCUPANT_SUCCESS,
            payload: response.data,
          });
        }
      },
      error: (err: any) => {
        // console.warn('Error: ', err);
        this.ngRedux.dispatch({
          type: FETCH_SINGLE_OCCUPANT_ERROR,
          payload: err,
        });
      },
    });
    this.Subscriptions.push(subscription);
  }

  UpdateOccupantDetails(Occupant: Occupant) {
    // UpdateOccupantAccountUrl
    return this._http.post(this.UpdateOccupantAccountUrl, Occupant)
    .pipe(catchError(handleError));
  }

  RemoveOccupant(Item: any) {
    let x: any = {
      occ_id: Item?.occ_id,
    };
    
    // return this._http.delete(this.RemoveOccupantUrl, x);
    return this._http.post(
      'https://lrp.mainlandcode.com/v1/api/delete-occupant',
      x
    )
    .pipe(catchError(handleError));
    // return this._http.delete(`${this.RemoveOccupantUrl}/${Item?.occ_id}`);
  }

  
  ngOnDestroy(): void {    
    this.Subscriptions.forEach((x) => {
      if (!x.closed) {
        x.unsubscribe();
      }
    });
  }
}

interface Occupant {
  occ_name: string;
  occ_state: string;
  occ_age: number;
  occ_gender: string;
}
