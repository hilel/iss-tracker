import { TestBed } from '@angular/core/testing';
import { Observable, throwError } from 'rxjs';
import { HttpMethod } from '@ngneat/spectator';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';

import { MapService } from './map.service';
import { APP_SETTINGS } from 'projects/core/src/public-api';
import { IssTrackerAppSettings } from '../../../../iss-tracker-app.settings';
import { IssTrackerService } from '../../iss-tracker.service';
import { getMockLocationObject } from '../../store/iss-tracker.reducer.spec';

describe('MapService', () => {
  let service: MapService;
  let httpMock: HttpTestingController;
  const mockAppSettings: typeof IssTrackerAppSettings = {
    api: {
      baseUrl: 'mock-base-api',
      external: {
        googleMapsApiUrl: 'mock-maps-api',
        getIssCurrentLocationUrl: 'mock-get-iss-location-url'
      }
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers:[
        { provide: APP_SETTINGS, useValue: mockAppSettings },
        MockProvider(IssTrackerService)
      ]
    });
    service = TestBed.inject(MapService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getIssCurrentLocationObservable method:', () => {

    it('should return IssTrackerService getIssCurrentLocationObservable method call', (done) => {
      const issTrackerService = TestBed.inject(IssTrackerService);
      const mockLocation = getMockLocationObject();
      spyOn(issTrackerService, 'getCurrentIssLocationObservable')
        .and.returnValue(of(mockLocation));
      const currentLocationObs = service.getIssCurrentLocationObservable();
      expect(currentLocationObs).toBeInstanceOf(Observable);
      expect(issTrackerService.getCurrentIssLocationObservable).toHaveBeenCalled();
      currentLocationObs.subscribe(_location => {
        expect(_location).toEqual(mockLocation);
        done();
      })
    });

  });

  describe('apiLoaded:', () => {

    it('should be false by default', () => {
      expect(service.apiLoaded).toBeFalse();
    });

  });

  describe('loadGoogleMapsApi method:', () => {

    const jsonpUrlSuffix = '?callback=JSONP_CALLBACK';
    const urlExpected = `${mockAppSettings.api.external.googleMapsApiUrl}${jsonpUrlSuffix}`;
    it('should return Observable', () => {
      const jsonpMapsApiObs = service.loadGoogleMapsApi();
      expect(jsonpMapsApiObs).toBeInstanceOf(Observable);
    });
    it('should send http jsonp request with right url from app settings', () => {
      const jsonpMapsApiObs = service.loadGoogleMapsApi();
      jsonpMapsApiObs.subscribe();// make the call
      const jsonpRequest = httpMock.expectOne(urlExpected);
      expect(jsonpRequest.request.method).toBe(HttpMethod.JSONP);
      jsonpRequest.flush(true);
    });
    it('should not send http request when apiLoaded is true', () => {
      service.apiLoaded = true;
      const http = TestBed.inject(HttpClient);
      spyOn(http, 'jsonp')
      service.loadGoogleMapsApi().subscribe();// make the call
      expect(http.jsonp).not.toHaveBeenCalled();
    });
    it('should return Observable of true when apiLoaded is true', (done) => {
      service.apiLoaded = true;
      service.loadGoogleMapsApi().subscribe((_result) => {
        expect(_result).toBeTrue();
        done();
      });
    });
    it('should return Observable of true on success', (done) => {
      const jsonpMapsApiObs = service.loadGoogleMapsApi();
      jsonpMapsApiObs.subscribe((_result) => {// make the call
        expect(_result).toBeTrue();
        done();
      });
      const jsonpRequest = httpMock.expectOne(urlExpected);
      jsonpRequest.flush('some-mock-ok-response');
    });
    it('should set apiLoaded property to true on success', (done) => {
      const jsonpMapsApiObs = service.loadGoogleMapsApi();
      jsonpMapsApiObs.subscribe((_result) => {// make the call
        expect(service.apiLoaded).toBeTrue();
        done();
      });
      const jsonpRequest = httpMock.expectOne(urlExpected);
      jsonpRequest.flush('some-mock-ok-response');
    });
    it('should return Observable of false on error', (done) => {
      const jsonpMapsApiObs = service.loadGoogleMapsApi();
      jsonpMapsApiObs.subscribe((_result) => {// make the call
        expect(_result).toBeFalse();
        done();
      });
      const jsonpRequest = httpMock.expectOne(urlExpected);
      jsonpRequest.error(new ErrorEvent('maps-api-load-error-event'));
    });
    it('should set apiLoaded property to false on error', (done) => {
      const jsonpMapsApiObs = service.loadGoogleMapsApi();
      jsonpMapsApiObs.subscribe((_result) => {// make the call
        expect(service.apiLoaded).toBeFalse();
        done();
      });
      const jsonpRequest = httpMock.expectOne(urlExpected);
      jsonpRequest.error(new ErrorEvent('maps-api-load-error-event'));
    });
    it('should call console error method on error with error object', (done) => {
      spyOn(console, 'error');
      const errorResponse = new HttpErrorResponse({
        error: { message: `mock-error-message.` },
        status: 400,
        statusText: 'Bad Request'
      });
      const http = TestBed.inject(HttpClient);
      spyOn(http, 'jsonp').and.returnValue(throwError(errorResponse));
      ;
      const jsonpMapsApiObs = service.loadGoogleMapsApi();
      jsonpMapsApiObs.subscribe((_result) => {// make the call
        expect(_result).toBeFalse();
        expect(console.error).toHaveBeenCalledWith(errorResponse);
        done();
      });
    });

  });

});
