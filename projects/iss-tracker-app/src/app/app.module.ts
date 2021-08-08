import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { APP_SETTINGS, IS_PRODUCTION } from 'projects/core/src/public-api';
import { IssTrackerAppSettings } from './iss-tracker-app.settings';
import { AppEffects } from './app.effects';
import { MainLayoutModule } from './layout/main-layout/main-layout.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([AppEffects]),

    MainLayoutModule
  ],
  providers: [
    {
      provide: APP_SETTINGS, useValue: IssTrackerAppSettings
    },
    {
      provide: IS_PRODUCTION, useValue: environment.production
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
