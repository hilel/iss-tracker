import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { ReportComponent } from './report.component';

@NgModule({
  declarations: [ReportComponent],
  imports: [
    CommonModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  exports: [ReportComponent]
})
export class ReportModule { }
