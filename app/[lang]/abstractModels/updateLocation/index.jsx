import { taggedSum } from 'daggy'
import { Free } from 'fantasy-frees'
const DO = F => Free.liftFC(F)

export const Actions = taggedSum('LocationActions', {
    queryLatLon: [],
    fetchLocation: ['latLon'],
    updateLocation: ['location'],
})

export const locationScript = () => DO(Actions.queryLatLon)
    .chain(latlon => DO(Actions.fetchLocation(latlon)))
    .chain(location => DO(Actions.updateLocation(location)))