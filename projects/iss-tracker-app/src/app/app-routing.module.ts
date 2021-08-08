import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

const routes: Routes = [
  { path: '', redirectTo: '/home/iss-tracker/(content:map)' , pathMatch: 'full' },
  {
    path: 'home', component: MainLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./pages/iss-tracker/iss-tracker.module').then(m => m.IssTrackerModule) }
    ]
  },
  { path: '**', redirectTo: '/home/iss-tracker/(content:map)' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
