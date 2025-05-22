import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';
import HomeComponent from '@flight-demo/shared/core';


export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'booking',
    loadChildren: () => import('@flight-demo/booking')
  },
  {
    path: 'checkin',
    loadChildren: () => import('@flight-demo/checkin')
  },
  {
    path: 'boarding',
    loadChildren: () => import('@flight-demo/boarding')
  },
  {
    path: 'miles',
    loadComponent: () => loadRemoteModule('miles', './Component') 
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
