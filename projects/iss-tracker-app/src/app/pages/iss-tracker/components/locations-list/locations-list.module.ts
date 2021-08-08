import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { LocationsListComponent } from './locations-list.component';

@NgModule({
  declarations: [LocationsListComponent],
  imports: [
    CommonModule,

    MatListModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    LocationsListComponent
  ]
})
export class LocationsListModule { }
