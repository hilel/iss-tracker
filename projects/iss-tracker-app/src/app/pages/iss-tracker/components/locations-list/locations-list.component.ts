import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { IssLocation } from 'projects/model/src/public-api';
import * as fromIssTracker from '../../store/iss-tracker.reducer';
import * as issTrackerActions from '../../store/iss-tracker.actions';

@Component({
  selector: 'app-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent implements OnInit, OnDestroy {
  public savedLocations$: Observable<IssLocation[]> | undefined;
  public searchSubject = new Subject<string>();// TODO: Test it
  public filteredLocations: IssLocation[] | undefined | null;

  private _geocoder: any;// google.maps.Geocoder | undefined;// TODO: Test it
  private _locationsSearchSubscription: Subscription | undefined | null;

  constructor(private _store: Store<fromIssTracker.IssTrackerState>) { }

  ngOnInit(): void {
    // TODO: Test this Observable
    this.savedLocations$ = this._store.select(fromIssTracker.getIssSavedLocations);
    this._setLocationsSearch();// TODO: Test setup
  }

  public removeLocation(location: IssLocation) {
    // TODO test it
    this._store.dispatch(issTrackerActions.removeSavedIssLocation({ location }));
  }

  private _setLocationsSearch() {
    // search by location name and lat/lng
    this._locationsSearchSubscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(term => {
        term = term.toLocaleLowerCase();
        if(!this.savedLocations$ || !term) {
          return of(null);
        }
        if(term.length < 3) {
          return of(this.filteredLocations || null);
        }
        console.log(term);
        return this.savedLocations$.pipe(
          map(_locations =>
            _locations.filter(_l => {
              const latLngTxt = `${_l.position?.latitude || ''}${_l.position?.longitude || ''}`;
              return _l && (
                          (_l.name || '').toLocaleLowerCase().includes(term)
                          || (latLngTxt.includes(term))
                        );
            })
          )
        );
      })
    ).subscribe(searchResults => {
      this.filteredLocations = searchResults;
    });
  }

  geocoderRunning: boolean = false;
  // returns empty string and meanwhile requests geocode of location
  // when it is arrived dispatches action on store to update locations name
  setLocationName(location: IssLocation): '' {
    // TODO: Test this method
    this._geocoder = this._geocoder || new ((<any>window).google.maps.Geocoder);
    if(!this.geocoderRunning && this._geocoder?.geocode && location.position?.valid()) {
      // const results = await
      this.geocoderRunning = true;
      this._geocoder.geocode({ location: location.toLatLng() })
      .then((response: { results: any[] }) => {;
        this.geocoderRunning = false;
        if (response.results && response.results[0].formatted_address) {// ?.length) {// gotSomeResults
          const name = response.results[0].formatted_address;
          this._store.dispatch(issTrackerActions.saveIssLocationName({ name, location }));
          // const countryResult = response.results.find(_r => {
          //   ;
          //   return _r;
          // });
        } else {
          console.log('Geocoder got not results');
        }
      })
      .catch((e: any) => {
        this.geocoderRunning = false;
        console.log('Geocoder failed due to: ', e)
      });
    }

    return '';
  }

  ngOnDestroy() {
    this._locationsSearchSubscription && this._locationsSearchSubscription.unsubscribe();
  }

}

