'use client'

import React, { useState } from 'react'
import Modal from '@mui/material/Modal'

import GoogleMap from 'components/GoogleMap/GoogleMap'
import styles from '../../../page.module.scss'
import { IconButton, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export type propsType = {
  lat: number
  lng: number
  full_address: string
}

export interface DialogTitleProps {
  id?: string
  children?: React.ReactNode
  onClose: () => void
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
        // hideBackdrop={true}
      >
        <div className={styles.workLocal}>
          <div className={styles.workLocal_head}>
            <span className={styles.workLocal_head_title}>Work Location</span>

            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon sx={{ color: '#BCBCBC' }} />
            </IconButton>
          </div>

          <div className={styles.workLocal_map}>
            <div className={styles.workLocal_map_wrapper}>
              <div className={styles.workLocal_map_wrapper_content} id='googleMapSoaWAErd4'>
                <GoogleMap
                  id='googleMapSoaWAErd4'
                  lat={Number(lat)}
                  lng={Number(lng)}
                  gestureHandling='auto'
                  zoomControl={true}
                  fullscreenControl={true}
                  streetViewControl={true}
                  clickable={true}
                  infoWindow={full_address}
                />
              </div>
            </div>
          </div>

          <div className={styles.workLocal_footer}>
            <Button
              variant='contained'
              sx={{
                width: '153px',
                height: '44px',
                background: '#136FD3',
                borderRadius: '10px',
                float: 'right',
                marginRight: '20px',
                textTransform: 'capitalize'
              }}
              onClick={() => setOpen(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  )
}

export default Map
