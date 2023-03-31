'use client'

import { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

import GoogleMap from 'components/GoogleMap/GoogleMap'
import styles from '../../../page.module.scss'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '739px'
}

export type propsType = {
  lat: number
  lng: number
  full_address: string
}

const Map = ({ lat, lng, full_address }: propsType) => {
  const [open, setOpen] = useState(false)

  const handleMapLayer = () => {
    setOpen(true)
  }

  return (
    <section className={styles.map}>
      <h5>Working Location</h5>
      <p>{full_address}</p>

      {lat && lng && (
        <div className={styles.map_context} onClick={handleMapLayer}>
          <GoogleMap
            lat={Number(lat)}
            lng={Number(lng)}
            gestureHandling='none'
            zoomControl={false}
            fullscreenControl={false}
            streetViewControl={false}
            clickable={false}
          />
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          <div className={styles.workLocal} id='googleMapSoaWAErd4'>
            <GoogleMap
              id='googleMapSoaWAErd4'
              lat={Number(lat)}
              lng={Number(lng)}
              gestureHandling='auto'
              zoomControl={true}
              fullscreenControl={true}
              streetViewControl={true}
              clickable={true}
            />
          </div>
        </Box>
      </Modal>
    </section>
  )
}

export default Map
