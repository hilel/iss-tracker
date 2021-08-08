import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { APP_SETTINGS } from 'projects/core/src/public-api';
import { IssTrackerAppSettings } from '../../iss-tracker-app.settings';
import { IIssLocationResponse, IssLocation } from 'projects/model/src/public-api';
import * as fromIssTracker from './store/iss-tracker.reducer';

@Injectable({ providedIn: 'root' })
export class IssTrackerService {

  constructor(
    private _http: HttpClient,
    private _store: Store<fromIssTracker.IssTrackerState>,
    @Inject(APP_SETTINGS) private _appSettings: typeof IssTrackerAppSettings,
  ) {
  }

  public getIssCurrentLocation(): Observable<IIssLocationResponse> {
    const url = this._appSettings.api.external.getIssCurrentLocationUrl;
    return this._http.get<IIssLocationResponse>(url);
  }

  public getCurrentIssLocationObservable(): Observable<IssLocation | null> {
    return this._store.select(fromIssTracker.getIssCurrentLocation);
  }

}
