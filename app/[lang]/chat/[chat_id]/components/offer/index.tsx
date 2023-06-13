/* eslint-disable no-unused-vars */
import React, {  } from 'react'
import OfferMessage from './offerMessage'
import OfferDetail from './offerDetail'

const OfferModal = (props: any) => {
    return<>
            <OfferDetail {...props}/>
            <OfferMessage {...props}/>
    </>
}
export default OfferModal