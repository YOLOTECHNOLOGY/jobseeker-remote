export const FB_PIXEL_ID = '159433614653827'

export const pageview = () => {
  window.fbq?.('track', 'PageView')
}

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => {
  window.fbq?.('track', name, options)
}