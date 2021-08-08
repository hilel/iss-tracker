import { createAction, props } from '@ngrx/store';

import { IIssLocationResponse, IssLocation } from 'projects/model/src/public-api';

export const startCurrentIssLocationPollingInterval = createAction(
  '[Iss Tracker] Start Current Iss Location Polling Interval',
  props<{ interval: number }>()
);
export const loadCurrentIssLocation = createAction(
  '[Iss Tracker] Load Current Iss Location'
);
export const loadCurrentIssLocationSuccess = createAction(
  '[Iss Tracker] Load Current Iss Location Success',
  props<{ issLocation: IIssLocationResponse }>()
);
export const loadCurrentIssLocationError = createAction(
  '[Iss Tracker] Load Current Iss Location Error',
  props<{ error: any }>()
);
export const saveCurrentIssLocation = createAction(
  '[Iss Tracker] Save Current Iss Location'
);
export const removeSavedIssLocation = createAction(
  '[Iss Tracker] Remove Saved Iss Location',
  props<{ location: IssLocation }>()
);
export const saveIssLocationName = createAction(
  '[Iss Tracker] Save Iss Location Country Name',
  props<{ location: IssLocation, name: string }>()
);
// export const setCurrentIssLocation = createAction(
//   '[Iss Tracker] Set Current Iss Location',
//   props<{ issLocation: IIssLocationResponse }>()// TODO MAPPED ?
// );
// export const saveRole = createAction(
//   '[IssTracker] Save Role',
//   props<{ role: INewRole, roleId?: string, companyId?: string }>()
// );
// export const saveRoleSucceed = createAction(
//   '[IssTracker] Save Role Succeed'
// );
// export const saveRoleFailed = createAction(
//   '[IssTracker] Save Role Failed',
//   props<{ errorMsg: string }>()
// );

// export const deleteRole = createAction(
//   '[IssTracker] Delete Role',
//   props<{ roleId: string }>()
// );
// export const deleteRoleSucceed = createAction(
//   '[IssTracker] Delete Role Succeed'
// );
// export const deleteRoleFailed = createAction(
//   '[IssTracker] Delete Role Failed',
//   props<{ errorMsg: string }>()
// );

// export const activeRoleDataSucceed = createAction(
//   '[IssTracker] Active Role Data Succeed'
// );

// export const startActiveRoleDataLoading = createAction(
//   '[IssTracker] Start Active Role Data Loading'
// );

// export const stopActiveRoleDataLoading = createAction(
//   '[IssTracker] Stop Active Role Data Loading'
// );

// export const setActiveRoleUsers = createAction(
//   '[IssTracker] Set Active Role Users',
//   props<{ users: User[] }>()
// );

// export const clearActiveRoleUsers = createAction(
//   '[IssTracker] Clear Active Role Users'
// );

// export const clearActiveRoleData = createAction(
//   '[IssTracker] Clear Active Role Data'
// );

// export const clearActiveRoleErrorMessage = createAction(
//   '[IssTracker] Clear Active Role Error Message'
// );
