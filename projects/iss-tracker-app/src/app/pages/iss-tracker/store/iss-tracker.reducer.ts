import { createReducer, on, createFeatureSelector, createSelector } from "@ngrx/store";
import { TypedAction } from "@ngrx/store/src/models";

import * as issTrackerActions from "./iss-tracker.actions";
import * as fromRoot from "../../../reducers";
import { IssLocation } from "projects/model/src/public-api";

export interface IssTrackerState {
  issCurrentLocation: IssLocation | null;
  issSavedLocations: IssLocation[];
  errorMessage: string | null;
};

export interface State extends fromRoot.State {
  issTracker: IssTrackerState;
};

export const initialState: IssTrackerState = {
  issCurrentLocation: null,
  issSavedLocations: [],
  errorMessage: null
};

const _issTrackerReducesReducer = createReducer(
  initialState,

  on(issTrackerActions.loadCurrentIssLocationSuccess, (state, action) => ({
    ...state,
    issCurrentLocation: new IssLocation(action.issLocation)
  })),
  on(issTrackerActions.loadCurrentIssLocationError, (state, action) => ({
    ...state,
    errorMessage: action.error.message
  })),
  on(issTrackerActions.saveCurrentIssLocation, (state, action) => ({
    ...state,// TODO test this action handler
    issSavedLocations:
          state.issSavedLocations
            .concat(// save if not null and not exists
              state.issCurrentLocation && !state.issSavedLocations.find(_l => _l.timestamp === state.issCurrentLocation?.timestamp)
              ? [state.issCurrentLocation]
              : []
            )
  })),
  on(issTrackerActions.saveIssLocationName, (state, action) => ({
    ...state,// TODO Test it
    issSavedLocations: state.issSavedLocations.map(_l => {
      if(_l.locationEquals(action.location)) {
        _l.name = action.name;
      }
      return _l;
    })
  })),
  on(issTrackerActions.removeSavedIssLocation, (state, action) => ({
    ...state,// TODO Test it
    issSavedLocations: state.issSavedLocations.filter(_l => {
      return !_l.locationEquals(action.location);
    })
  })),
);

export function createIssTrackerReducer(state: any, action: TypedAction<any>) {
  return _issTrackerReducesReducer(state, action);
}

export const getIssTrackerState = createFeatureSelector<IssTrackerState>('iss-tracker');
export const getIssCurrentLocation = createSelector(getIssTrackerState, (state: IssTrackerState) => state.issCurrentLocation);
export const getIssSavedLocations = createSelector(getIssTrackerState, (state: IssTrackerState) => state.issSavedLocations);
// export const getActiveRoleDataLoading = createSelector(getIssTrackerState, (state: IssTrackerState) => state.activeRoleDataLoading);
// export const getActiveRoleUsers = createSelector(getIssTrackerState, (state: IssTrackerState) => state.activeRoleUsers);
// export const getRoleErrorMessage = createSelector(getIssTrackerState, (state: IssTrackerState) => state.errorMessage);
