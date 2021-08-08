import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MockModule } from 'ng-mocks';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LocationsListComponent } from './locations-list.component';
import * as fromIssTracker from '../../store/iss-tracker.reducer';
import * as issTrackerActions from '../../store/iss-tracker.actions';

describe('LocationsListComponent', () => {
  let component: LocationsListComponent;
  let fixture: ComponentFixture<LocationsListComponent>;

  let mockStore: MockStore<fromIssTracker.State>;
  const initialState: fromIssTracker.State = {
    issTracker: fromIssTracker.initialState
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationsListComponent ],
      imports: [
        MockModule(MatListModule),
        MockModule(MatInputModule),
        MockModule(MatFormFieldModule),
        MockModule(MatButtonModule),
        MockModule(MatIconModule)
      ],
      providers: [provideMockStore({ initialState })]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject<MockStore<fromIssTracker.State>>(MockStore);
  });

  it('should create', () => {
    mockStore.overrideSelector(fromIssTracker.getIssSavedLocations, []);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
