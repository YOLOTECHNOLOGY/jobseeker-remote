'use client'

import { useState } from 'react'
import Dialog from '@mui/material/Dialog'

import GoogleMap from 'components/GoogleMap/GoogleMap'
import styles from '../../../page.module.scss'

export type propsType = {
  lat: number
  lng: number
  full_address: string
}

const Map = ({ lat, lng, full_address }: propsType) => {
  const [open, setOpen] = useState(false)

  const handleMapLayer = () => {
    setOpen(true)
    console.log('onclick')
  }

  return (
    <section className={styles.map}>
      <h5>Working Location</h5>
      <p>{full_address}</p>

      {lat && lng && (
        <div className={styles.map_context} onClick={handleMapLayer}>
          <GoogleMap lat={Number(lat)} lng={Number(lng)} />
        </div>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth={true}>
        <div className={styles.workLocal} id='googleMapSoaWAErd4'>
          <GoogleMap lat={Number(lat)} lng={Number(lng)} id='googleMapSoaWAErd4' />
        </div>
      </Dialog>
    </section>
  )
}

export default Map
