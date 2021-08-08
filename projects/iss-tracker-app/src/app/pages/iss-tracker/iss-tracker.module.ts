import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutModule } from '@angular/cdk/layout';

import { IssTrackerComponent } from './iss-tracker.component';
import { IssTrackerEffects } from './store/iss-tracker.effects';
import { createIssTrackerReducer } from './store/iss-tracker.reducer';
import { MainLayoutModule } from '../../layout/main-layout/main-layout.module';
import { MapModule } from './components/map/map.module';
import { MapComponent } from './components/map/map.component';
import { LocationsListModule } from './components/locations-list/locations-list.module';
import { ReportModule } from './components/report/report.module';
import { ReportComponent } from './components/report/report.component';

const issTrackerRoutes: Routes = [
  {
    path: '', redirectTo: 'iss-tracker', pathMatch: 'prefix'
  },
  {
    path: 'iss-tracker', component: IssTrackerComponent, children: [
      { path: '', redirectTo: 'map', pathMatch: 'full' },
      { path: 'map', component: MapComponent, outlet: 'content' },
      { path: 'report', component: ReportComponent, outlet: 'content' }
    ]
  }
];

@NgModule({
  declarations: [
    IssTrackerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(issTrackerRoutes),
    HttpClientModule,

    StoreModule.forFeature('iss-tracker', createIssTrackerReducer),
    EffectsModule.forFeature([IssTrackerEffects]),

    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatTooltipModule,
    LayoutModule,

    MainLayoutModule,
    MapModule,
    LocationsListModule,
    ReportModule
  ]
})
export class IssTrackerModule { }
