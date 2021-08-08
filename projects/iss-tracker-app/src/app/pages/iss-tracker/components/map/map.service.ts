import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APP_SETTINGS } from 'projects/core/src/public-api';
import { IssTrackerAppSettings } from '../../../../iss-tracker-app.settings';
import { IssTrackerService } from '../../iss-tracker.service';
import { IssLocation } from 'projects/model/src/public-api';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  apiLoaded: boolean = false;

  constructor(
    private _http: HttpClient,
    @Inject(APP_SETTINGS) private _appSettings: typeof IssTrackerAppSettings,
    private _issTrackerService: IssTrackerService
  ) { }

  public getIssCurrentLocationObservable(): Observable<IssLocation | null> {
    return this._issTrackerService.getCurrentIssLocationObservable();
  }

  public loadGoogleMapsApi(): Observable<boolean> {
    if(this.apiLoaded) {
      return of(true);
    }
    return this._http.jsonp(
      this._appSettings.api.external.googleMapsApiUrl, 'callback'
    )
      .pipe(
        map(() => {
          this.apiLoaded = true;
          return true;
        }),
        catchError((_error) => {
          console.error(_error);
          this.apiLoaded = false;
          return of(false);
        })
      );
  }
}
