import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { EMPTY, Observable } from 'rxjs';
import { MockComponent, MockModule } from 'ng-mocks';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutModule } from '@angular/cdk/layout';

import { IssTrackerComponent } from './iss-tracker.component';
import * as fromIssTracker from './store/iss-tracker.reducer';
import * as issTrackerActions from './store/iss-tracker.actions';
import { getMockLocationObject } from './store/iss-tracker.reducer.spec';
import { IssLocation } from 'projects/model/src/public-api';
import { LocationsListModule } from './components/locations-list/locations-list.module';

describe('IssTrackerComponent', () => {
  let component: IssTrackerComponent;
  let fixture: ComponentFixture<IssTrackerComponent>;

  let mockStore: MockStore<fromIssTracker.State>;
  const initialState: fromIssTracker.State = {
    issTracker: fromIssTracker.initialState
  };
  let mockLocation: IssLocation;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssTrackerComponent],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MockModule(MatSidenavModule),
        MockModule(MatTabsModule),
        MockModule(MatButtonModule),
        MockModule(MatToolbarModule),
        MockModule(MatIconModule),
        MockModule(MatTooltipModule),
        MockModule(LayoutModule),

        MockModule(LocationsListModule)
      ],
      providers: [ provideMockStore({ initialState }) ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssTrackerComponent);
    mockStore = TestBed.inject<MockStore<fromIssTracker.State>>(MockStore);
    component = fixture.componentInstance;

    mockLocation = getMockLocationObject();
    mockStore.overrideSelector(
      fromIssTracker.getIssCurrentLocation,
      mockLocation
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('general:', () => {

    it('should have interval property with value of 2000 by default', () => {
      expect(fixture.componentInstance.interval).toEqual(2000);
    });

    it('should call dispatch startCurrentIssLocationPollingInterval on init', async () => {
      spyOn(mockStore, 'dispatch');
      fixture.detectChanges();
      await fixture.whenStable();// wait for promises to resolve...
      const interval = fixture.componentInstance.interval;
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        issTrackerActions.startCurrentIssLocationPollingInterval({ interval })
      );
    });

  })

  describe('issLocation$:', () => {

    it('should be Observable', () => {
      fixture.detectChanges();
      expect(fixture.componentInstance.issLocation$).toBeInstanceOf(Observable);
    });
    it('should call store getIssCurrentLocation selector', () => {
      spyOn(mockStore, 'select').and.returnValue(EMPTY);
      fixture.detectChanges();
      expect(mockStore.select).toHaveBeenCalledWith(
        fromIssTracker.getIssCurrentLocation
      );
    });
    it('should be Observable of state get current location selector', (done) => {
      fixture.detectChanges();
      // || EMPTY Because of angular 11 typescript strict types
      (fixture.componentInstance.issLocation$ || EMPTY).subscribe(_location => {;
        expect(_location).toEqual(mockLocation);
        done();
      });
    });

  });


  describe('saveCurentLocation method', () => {

    it('should dispatch saveCurrentIssLocation action on store', () => {
      spyOn(mockStore, 'dispatch');
      component.saveCurentLocation();
      expect(mockStore.dispatch).toHaveBeenCalledWith(
        issTrackerActions.saveCurrentIssLocation()
      );
    });

  });

  // TODO: test click from template


});
