import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, expand, map, mapTo, switchMap } from 'rxjs/operators';
import { of, timer } from 'rxjs';

import * as issTrackerActions from './iss-tracker.actions';
import { IssTrackerService } from '../iss-tracker.service';
import { TypedAction } from '@ngrx/store/src/models';

@Injectable()
export class IssTrackerEffects {

  // onSaveCurrentIssLocation$ = createEffect(() => {// no need for this effect
  //   return this.actions$.pipe(
  //     ofType(issTrackerActions.saveCurrentIssLocation),
  //     map(action => issTrackerActions.saveCurrentIssLocation())
  //   )
  // });

  onStartCurrentIssLocationPollingInterval$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(issTrackerActions.startCurrentIssLocationPollingInterval),
      switchMap(action =>
        // this._issTrackerService.getIssCurrentLocation().pipe(
          // expand(_ => // wait till outgoing response finishes
            timer(0, action.interval).pipe(// 0 delay to start right away
              mapTo(
                issTrackerActions.loadCurrentIssLocation()
              )
            )
          // )
        // )
      )
    );
  });

  onLoadCurrentIssLocation$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(issTrackerActions.loadCurrentIssLocation),
      concatMap(() =>
        this._issTrackerService.getIssCurrentLocation()
          .pipe(
            map(issLocation =>
              issTrackerActions.loadCurrentIssLocationSuccess({ issLocation })
            ),
            catchError(error => {
              return of(issTrackerActions.loadCurrentIssLocationError({ error }))
            })
          )
      )
    );
  });

  // onLoadCurrentIssLocation$ = createEffect(() => {
  //   return this.actions$.pipe(

  //     ofType(IssTrackerActions.loadCurrentIssLocation),
  //     concatMap(() =>
  //       EMPTY.pipe(
  //         map(data => IssTrackerActions.clearRoles()),
  //         catchError(error => of(IssTrackerActions.clearRoles())))
  //     )
  //   );
  // });



  constructor(
    private actions$: Actions,
    private _issTrackerService: IssTrackerService
  ) {}

}
