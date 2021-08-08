import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { GoogleMap, MapMarker } from '@angular/google-maps';

import { MapService } from './map.service';
import { IssLocation } from 'projects/model/src/public-api';
import { MapSettings } from './map-settings';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnDestroy {
  public mapOptions: google.maps.MapOptions = MapSettings.defaultMapOptions;
  public issLocation$: Observable<IssLocation | null> | undefined;
  public issLocation: IssLocation | null | undefined;
  public issMarkerOptions: google.maps.MarkerOptions | undefined;
  public issMarkerPosition: google.maps.LatLngLiteral | undefined;

  public mapsApiReady$: Observable<boolean>;
  public mapsApiReady: boolean = false;
  private _issLocationSubscription: Subscription | undefined;
  private _mapsApiReadySubscription: Subscription | undefined;

  constructor(private _mapService: MapService) {
    this.mapsApiReady$ = this._mapService.loadGoogleMapsApi();
    // TODO TEST _mapsApiReadySubscription unsubscribes
    this._mapsApiReadySubscription = this.mapsApiReady$.subscribe((_ready) => {
      // TODO TEST sets marker options only if ready true
      if(_ready) {// if not ready marker options will get error google not defined
        this.mapsApiReady = true;
        this.issMarkerOptions = this._getIssMarkerOptions();
      }
    })
  }

  ngOnInit(): void {
    this.issMarkerOptions
    this.issLocation$ = this._mapService.getIssCurrentLocationObservable();

    this._issLocationSubscription = this.issLocation$.subscribe(_location => {
      if(_location && _location.position?.valid) {
        this.issLocation = _location;
        this._setIssMarkerPosition(_location);
        this._resetMapCenter(_location);
      }
    });
  }

  private _setIssMarkerPosition(location: IssLocation) {
    // Todo: Test it
    this.issMarkerPosition = location.toLatLng();
  }

  private _resetMapCenter(location: IssLocation) {
    // Todo: Test it
    this.mapOptions.center = location.toLatLng();
  }

  private _getIssMarkerOptions (): google.maps.MarkerOptions {
    // TODO: Test options are good and get to the map-marker component inputs
    return {
      draggable: false,
      icon: {
        url: MapSettings.issMarkerOptions.issIconUrl,
        scaledSize: new google.maps.Size(100, 100),
        anchor: new google.maps.Point(50, 50)// half of size ot center it on the latlng
      },
      optimized: false// fixes svg rendering issue on zooming
    }
  }


  ngOnDestroy() {
    // have to unsubscribe because angular unsubscribes only async pipe for us
    this._issLocationSubscription && this._issLocationSubscription.unsubscribe();
    this._mapsApiReadySubscription && this._mapsApiReadySubscription.unsubscribe();
  }

}
