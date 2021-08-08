import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map, shareReplay, take } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import * as fromIssTracker from './store/iss-tracker.reducer';
import * as issTrackerActions from './store/iss-tracker.actions';
import { IssLocation } from 'projects/model/src/public-api';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-iss-tracker',
  templateUrl: './iss-tracker.component.html',
  styleUrls: ['./iss-tracker.component.scss']
})
export class IssTrackerComponent implements OnInit {
  @Input() interval: number = 2000;

  public issLocation$: Observable<IssLocation | null> | undefined;
  public activeLink: 'map' | 'report' | undefined;// TODO: Test it
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(// TODO: Test it
      map(result => result.matches),
      shareReplay()
    );


  constructor(
    private breakpointObserver: BreakpointObserver,
    private _store: Store<fromIssTracker.IssTrackerState>,
    private _route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.issLocation$ = this._store.select(fromIssTracker.getIssCurrentLocation);
    this._store.dispatch(issTrackerActions.startCurrentIssLocationPollingInterval({
      interval: this.interval
    }));

    // fixes bug - if refreshes on reports the save button will appear
    // TODO: Test it
    this.activeLink = this._location.path().includes(':report') ? 'report' : 'map';
  }

  saveCurentLocation(): void {
    this._store.dispatch(issTrackerActions.saveCurrentIssLocation());
  }

}
