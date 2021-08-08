import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';

import { MapComponent } from './map.component';

@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    HttpClientJsonpModule,

    GoogleMapsModule
  ],
  exports: [MapComponent]
})
export class MapModule { }
