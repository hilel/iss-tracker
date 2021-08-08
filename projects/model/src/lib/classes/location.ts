import { ILocation } from "../interfaces/i-location";

export class Location implements ILocation {
  public latitude: number;
  public longitude: number;
  // public altitude?: number | undefined;
  /**
   *
   */
  constructor(location: ILocation) {
    this.latitude = parseFloat(location.latitude+'');
    this.longitude = parseFloat(location.longitude+'');
    // this.altitude = location.altitude || -1;
  }

  public equals(otherLocation: Location | undefined): boolean {
    return !!otherLocation
            && this.latitude === otherLocation.latitude
            && this.longitude === otherLocation.longitude;
  }

  public valid(): boolean {
    return !!this.latitude  && !!this.longitude;
  }
}
