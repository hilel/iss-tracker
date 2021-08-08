import * as fromIssTracker from './iss-tracker.reducer';
import * as issTrackerActions from './iss-tracker.actions';
import { IIssLocationResponse, IssLocation } from 'projects/model/src/public-api';

describe('Iss Tracker Store:', () => {

  afterEach(() => fromIssTracker.initialState.issCurrentLocation = null);

  it('should return initial state', () => {
    const { initialState } = fromIssTracker;
    const state = fromIssTracker.createIssTrackerReducer(undefined, { type: null });
    expect(state).toBe(initialState);
  });

  describe('on loadCurrentIssLocationSuccess action:', () => {

    it('should set current iss location on state', () => {
      const { initialState } = fromIssTracker;
      const issLocationResp = getMockLocationResponse();
      const action = issTrackerActions.loadCurrentIssLocationSuccess({
        issLocation: issLocationResp
      });
      const state = fromIssTracker.createIssTrackerReducer(initialState, action);
      const expectedMappedLocation = new IssLocation(issLocationResp);
      expect(state.issCurrentLocation).toEqual(expectedMappedLocation);
    });

  });

  describe('on loadCurrentIssLocationError action:', () => {

    it('should set current iss location on state', () => {
      const { initialState } = fromIssTracker;
      const mockError = { message: 'mock error message' };
      const action = issTrackerActions.loadCurrentIssLocationError({
        error: mockError
      });
      const state = fromIssTracker.createIssTrackerReducer(initialState, action);
      expect(state.errorMessage).toEqual(mockError.message);
    });

  });




});

export function getMockLocationResponse(): IIssLocationResponse {
  return {
    message: 'success',
    iss_position: { latitude: -38.0613, longitude: -162.3821 },
    timestamp: 1628270733
  }
}

export function getMockLocationObject(locationResp = getMockLocationResponse()): IssLocation {
  return new IssLocation(locationResp);
}
