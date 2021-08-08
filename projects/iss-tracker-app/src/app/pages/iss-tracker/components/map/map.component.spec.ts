import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockModule, MockProvider, MockService } from 'ng-mocks';
import { EMPTY, Observable, of, Subscription } from 'rxjs';
import { GoogleMapsModule } from '@angular/google-maps';

import { MapComponent } from './map.component';
import { MapService } from './map.service';
import { IssLocation } from 'projects/model/src/public-api';
import { getMockLocationObject } from '../../store/iss-tracker.reducer.spec';
import { MapSettings } from './map-settings';

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let mockMapService: MapService;
  let mockLocation: IssLocation;
  beforeEach(async () => {
    mockLocation = getMockLocationObject();
    mockMapService = MockService(MapService, {
      apiLoaded: false,
      loadGoogleMapsApi: () => EMPTY,
      getIssCurrentLocationObservable: () => of(mockLocation)
    });
    await TestBed.configureTestingModule({
      declarations: [ MapComponent ],
      imports: [
        NoopAnimationsModule,
        MockModule(GoogleMapsModule)
      ],
      providers: [
        MockProvider(MapService, mockMapService)
      ]
    })
    .compileComponents();
    (<any>window.google) = {// mock google maps
      maps: {
        Size: class MockSize {},
        Point: class MockPoint {}
      }
     }
  });

  // because we need to test constructor, don`t create component in beforeEach

  it('should create', () => {
    fixture = TestBed.createComponent(MapComponent);
    expect(component).toBeTruthy();
  });

  describe('calling loadGoogleMapsMethod:', () => {

    beforeEach(() => {
      spyOn(mockMapService, 'loadGoogleMapsApi').and.returnValue(of(true));
      fixture = TestBed.createComponent(MapComponent);
    });

    it('should call map service loadGoogleMapsMethod before ngOnInit', () => {
      const mapService = TestBed.inject(MapService);
      // not running fixture.detectChanges() - to test before ngOnInit
      expect(mapService.loadGoogleMapsApi).toHaveBeenCalledOnceWith();
    });

    it('should set apiReady property with returned value', async () => {
      const mapService = TestBed.inject(MapService);
      expect(mapService.loadGoogleMapsApi).toHaveBeenCalledTimes(1);
      fixture.detectChanges();
      await fixture.whenStable();// wait for promises to resolve...
      expect(fixture.componentInstance.mapsApiReady).toBeTrue();
    });

  });

  describe('mapsApiReady$:', () => {

    beforeEach(async () => {
      fixture = TestBed.createComponent(MapComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();// wait for promises to resolve...
    });

    it('should be Observable', () => {
      // EMPTY does not resolve value - no need for value here
      spyOn(mockMapService, 'loadGoogleMapsApi').and.returnValue(EMPTY);
      expect(component.mapsApiReady$).toBeInstanceOf(Observable);
    });

  });

  describe('issLocation$:', () => {

    beforeEach(() => {
      fixture = TestBed.createComponent(MapComponent);
      component = fixture.componentInstance;
    });

    it('should be Observable', () => {
      fixture.detectChanges();
      expect(fixture.componentInstance.issLocation$).toBeInstanceOf(Observable);
    });
    it('should call MapService getIssCurrentLocationObservable method', () => {
      const mapService = TestBed.inject(MapService);
      spyOn(mapService, 'getIssCurrentLocationObservable').and.returnValue(EMPTY);
      fixture.detectChanges();
      expect(mapService.getIssCurrentLocationObservable).toHaveBeenCalledOnceWith();
    });
    it('should be Observable return by getIssCurrentLocationObservable method', (done) => {
      const mapService = TestBed.inject(MapService);
      spyOn(mapService, 'getIssCurrentLocationObservable')
        .and.returnValue(of(mockLocation));
      fixture.detectChanges();
      component.issLocation$?.subscribe(_location => {
        expect(_location).toEqual(mockLocation);
        done();
      });

    });
    it('should be subscribed and set _issLocationSubscription property', () => {
      const mapService = TestBed.inject(MapService);
      spyOn(mapService, 'getIssCurrentLocationObservable')
        .and.returnValue(of(mockLocation));
      fixture.detectChanges();
      expect((component as any)._issLocationSubscription).toBeInstanceOf(Subscription);
    });
    it('should be subscribed and set issLocation property', async () => {
      const mapService = TestBed.inject(MapService);
      spyOn(mapService, 'getIssCurrentLocationObservable')
        .and.returnValue(of(mockLocation));
      fixture.detectChanges();
      await fixture.whenStable();// wait for promises to resolve...
      expect(component.issLocation).toEqual(mockLocation);
    });
    it('should be unsubscribed on destroy', () => {
      fixture.detectChanges();
      spyOn((component as any)._issLocationSubscription, 'unsubscribe');
      fixture.destroy();
      expect((component as any)._issLocationSubscription.unsubscribe).toHaveBeenCalled();
    });

  });

  describe('mapOptions:', () => {

    beforeEach(async () => {
      fixture = TestBed.createComponent(MapComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();// wait for promises to resolve...
    });

    it('should set default map options', () => {
      expect(component.mapOptions).toEqual(MapSettings.defaultMapOptions);
    });

  });

  // TODO: Test Marker Options sets issMarker location when has good value
  // TODO: Test Marker Options on good/bad IssLocation$ location values
  // TODO: Test Reset Map Center when has good location value
  // TODO: Test Marker Renders only when has good location value


});
