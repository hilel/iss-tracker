const apiKeys = {
  googleApiKey: 'AIzaSyCB4eOBGYdR0Cf5jxW0WUm-q1jjQOrHa3Y'
}

export const IssTrackerAppSettings = {
  api: {
    baseUrl: 'api',
    external: {
      googleMapsApiUrl: `https://maps.googleapis.com/maps/api/js?key=${apiKeys.googleApiKey}`,
      getIssCurrentLocationUrl: 'http://api.open-notify.org/iss-now.json',
    }
  }
}
