import { InjectionToken } from '@angular/core';

export const APP_SETTINGS = new InjectionToken<string>('AppSettings');

export const IS_PRODUCTION = new InjectionToken<string>('IsProduction');
