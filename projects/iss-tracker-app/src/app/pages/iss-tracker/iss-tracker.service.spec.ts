import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator';
import { Observable } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { IssTrackerService } from './iss-tracker.service';
import { APP_SETTINGS } from 'projects/core/src/public-api';
import { IssTrackerAppSettings } from '../../iss-tracker-app.settings';
import * as fromIssTracker from './store/iss-tracker.reducer';
import * as issTrackerActions from './store/iss-tracker.actions';
import { getMockLocationObject } from './store/iss-tracker.reducer.spec';
import { IssLocation } from 'projects/model/src/public-api';


describe('IssTrackerService:', () => {
  let spectator: SpectatorHttp<IssTrackerService>;
  const mockAppSettings: typeof IssTrackerAppSettings = {
    api: {
      baseUrl: 'mock-base-api',
      external: {
        googleMapsApiUrl: 'mock-maps-api',
        getIssCurrentLocationUrl: 'mock-get-iss-location-url'
      }
    }
  }
  let mockStore: MockStore<fromIssTracker.State>;
  const initialState: fromIssTracker.State = {
    issTracker: fromIssTracker.initialState
  };
  const createHttp = createHttpFactory({
    service: IssTrackerService,
    imports: [
      RouterTestingModule, HttpClientTestingModule
    ],
    providers:[
      provideMockStore({ initialState }),
      { provide: APP_SETTINGS, useValue: mockAppSettings }
    ]
  });

  beforeEach(() => {
    spectator = createHttp();
    mockStore = spectator.inject<MockStore<fromIssTracker.State>>(MockStore);
  });

    it('should be created', () => expect(spectator.service).toBeTruthy());

    describe('getIssCurrentLocation method:', () => {

      it('should return Observable', () => {
        const getIssLocationObs = spectator.service.getIssCurrentLocation();
        expect(getIssLocationObs).toBeInstanceOf(Observable);
      });
      it('should send http get request with right url from app settings', () => {
        const urlExpected = mockAppSettings.api.external.getIssCurrentLocationUrl;
        const getIssLocationObs = spectator.service.getIssCurrentLocation();
        getIssLocationObs.subscribe();// make the call
        const getRequest = spectator.expectOne(urlExpected, HttpMethod.GET);
        getRequest.flush('', { status: 200, statusText: 'OK'});
      });

    });

    describe('getCurrentIssLocationObservable method:', () => {
      let mockLocation: IssLocation;
      beforeEach(() => {
        mockLocation = getMockLocationObject();
        mockStore.overrideSelector(
          fromIssTracker.getIssCurrentLocation, mockLocation
        )
      });

      it('should return Observable of store curren iss location', (done) => {
        const getIssLocationObs = spectator.service.getCurrentIssLocationObservable();
        expect(getIssLocationObs).toBeInstanceOf(Observable);
        getIssLocationObs.subscribe((_location) => {
          expect(_location).toEqual(mockLocation);
          done();
        })
      });

    });

  });
