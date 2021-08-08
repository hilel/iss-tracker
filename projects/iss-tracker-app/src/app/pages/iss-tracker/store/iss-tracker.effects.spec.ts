import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { createServiceFactory, mockProvider, SpectatorService } from '@ngneat/spectator';
import { MockModule, MockService } from 'ng-mocks';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { asyncScheduler, EMPTY, Observable, of, throwError } from 'rxjs';
import { fakeAsync, tick as _tick } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';

import { IssTrackerEffects } from './iss-tracker.effects';
import { IssTrackerService } from '../iss-tracker.service';
import * as fromIssTracker from './iss-tracker.reducer';
import * as issTrackerActions from './iss-tracker.actions';
import { getMockLocationResponse } from './iss-tracker.reducer.spec';
import { MatTabsModule } from '@angular/material/tabs';
import { Location } from '@angular/common';

describe('IssTrackerEffects:', () => {
  let actions$: Observable<any>;
  let spectator: SpectatorService<IssTrackerEffects>;
  let issTrackerService: IssTrackerService;
  let mockStore: MockStore<fromIssTracker.State>;
  const initialState: fromIssTracker.State = {
    issTracker: fromIssTracker.initialState
  };
  const createEffectsService = createServiceFactory({
    service: IssTrackerEffects,
    imports: [
      RouterTestingModule,
      MockModule(MatTabsModule)
    ],
    providers:[
      provideMockStore({ initialState }),
      provideMockActions(() => actions$),
      mockProvider(IssTrackerService, MockService(IssTrackerService)),
      mockProvider(Location, MockService(Location))
    ]
  });

  beforeEach(() => {
    spectator = createEffectsService();
    issTrackerService = spectator.inject(IssTrackerService);
    mockStore = spectator.inject<MockStore<fromIssTracker.State>>(MockStore);
  });

    it('should be created', () => expect(spectator.service).toBeTruthy());

    describe('onStartCurrentIssLocationPollingInterval$:', () => {

      let tick: (milliseconds: number) => void;

      beforeEach(() => {
        let fakeNow = 0;
        tick = milliseconds => {
          fakeNow += milliseconds;
          _tick(milliseconds);
        };
        asyncScheduler.now = () => fakeNow;
      });

      it('should dispatch loadCurrentIssLocation action every given interval', fakeAsync(() => {
        let interval = 2000;
        const timesToTestInterval = 5;
        actions$ = of(
          issTrackerActions.startCurrentIssLocationPollingInterval({ interval })
        );
        let actionCallsCount = 0;
        const subscription =
          spectator.service.onStartCurrentIssLocationPollingInterval$.subscribe(
            (resultAction) => {
              expect(resultAction.type).toEqual(
                issTrackerActions.loadCurrentIssLocation.type
              );
              actionCallsCount++;
            }
          );
        expect(actionCallsCount).toEqual(0);
        tick(0);
        expect(actionCallsCount).toEqual(1);// 1st immediate
        for (let index = 1; index < timesToTestInterval; index++) {
          tick(interval);// next interval
          expect(actionCallsCount).toEqual(index + 1);// + 1st immediate
        }
        expect(actionCallsCount).toEqual(timesToTestInterval);// total calls
        subscription.unsubscribe();// ensure to exit interval
      }));

    });

    describe('onLoadCurrentIssLocation$:', () => {

      it('should call getIssCurrentLocation on iss tracker service', () => {
        actions$ = of(issTrackerActions.loadCurrentIssLocation());
        spyOn(issTrackerService, 'getIssCurrentLocation').and.returnValue(EMPTY);
        spectator.service.onLoadCurrentIssLocation$.subscribe();
        expect(issTrackerService.getIssCurrentLocation).toHaveBeenCalledWith();
      });
      it('should call loadCurrentIssLocationSuccess action with response location', (done) => {
        actions$ = of(issTrackerActions.loadCurrentIssLocation());
        const mockLocationResp = getMockLocationResponse();
        spyOn(issTrackerService, 'getIssCurrentLocation')
          .and.returnValue(of(mockLocationResp));
        spectator.service.onLoadCurrentIssLocation$.subscribe(resultAction => {
          expect(resultAction).toEqual(
            issTrackerActions.loadCurrentIssLocationSuccess({
              issLocation: mockLocationResp
            })
          );
          done();
        });
      });

      it('should call loadCurrentIssLocationError action with response error', (done) => {
        actions$ = of(issTrackerActions.loadCurrentIssLocation());
        const mockError: HttpErrorResponse = {
          status: 500, message: 'mock error message', url: 'mock-get-url'
        } as HttpErrorResponse;
        spyOn(issTrackerService, 'getIssCurrentLocation')
          .and.returnValue(throwError(mockError));
        spectator.service.onLoadCurrentIssLocation$.subscribe(resultAction => {
          expect(resultAction).toEqual(
            issTrackerActions.loadCurrentIssLocationError({
              error: mockError
            })
          );
          done();
        });
      });

    });

});
