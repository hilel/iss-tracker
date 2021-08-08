import { ILocation } from "./i-location";

export interface IIssLocationResponse {
  message: string | 'success';
  iss_position: ILocation;
  timestamp: number;
}
