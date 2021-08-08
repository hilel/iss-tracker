interface IMapSettings {
  defaultMapOptions: google.maps.MapOptions;
  issMarkerOptions: {
    issIconUrl: string
  };
}

export const MapSettings: IMapSettings = {
  defaultMapOptions: {
    center: { lat: 40, lng: -20 },
    zoom: 2
  },
  issMarkerOptions: {
    issIconUrl: 'assets/images/satellite-icon.svg'
  }
}
