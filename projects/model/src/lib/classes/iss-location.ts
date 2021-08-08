import { IIssLocationResponse } from "../interfaces/i-iss-location-response";
import { Location } from "./location";

export class IssLocation {
  public name: string = 'Somewhere';
  public message: string | 'success' | undefined | null;
  public position: Location | undefined | null;
  public timestamp: Date;
  /**
   *
   */
  constructor(issLocationResponse: IIssLocationResponse) {
    this.message = issLocationResponse.message;
    this.position = new Location(issLocationResponse.iss_position);
    // const unixDate = new Date(issLocationResponse.timestamp);
    this.timestamp = new Date(issLocationResponse.timestamp * 1000);// * 1000 to convert from unix timestamp
    // this.timestamp.setSeconds(unixDate.getSeconds());
  }

  public locationEquals(otherLocation: IssLocation): boolean {
    if(!this.position || !otherLocation.position) {
      return false;
    }
    return this.position.equals(otherLocation.position);
  }

  public toLatLng(): google.maps.LatLngLiteral {
    if(this.position?.valid()) {
      return {
        lat: this.position.latitude,
        lng: this.position.longitude
      }
    }
    return { lat: -1, lng: -1 };
  }

}
