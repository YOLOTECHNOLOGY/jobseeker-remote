import React, { useEffect, useState } from 'react'

import Text from 'components/Text'
import BraintreeWeb from 'braintree-web'
import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'

import { Button } from '@mui/material'

import getBraintreeClientTokenService from 'store/services/payment/getBraintreeClientTokenService'

import styles from './CreditCardFrom.module.scss'
import { useFirstRender } from 'helpers/useFirstRender'

const CreditCardFrom = ({ label, setEdit, edit }: any) => {
  const firstRender = useFirstRender()
  const [cvv, setCvv] = useState(null)
  const [fieldsState, setFieldsState] = useState(null)
  const [unsupportedCard, setUnsupportedCard] = useState(false)
  const [isUnsupportedCard, setIsUnsupportedCard] = useState(false)
  const [braintreeClientToken, setBraintreeClientToken] = useState(null)
  const [hostedFieldsInstance, setHostedFieldsInstance] = useState(null)
  const [errorTips, setErrorTips] = useState(false)
  const [isBtnDisabled] = useState(true)

  useEffect(() => {
    console.log(cvv, isUnsupportedCard)
    if (firstRender && braintreeClientToken) {
      return
    }
    ;(async () => {
      const { data } = await getBraintreeClientTokenService()
      if (data.success) {
        setBraintreeClientToken(data.data.token)
      }
    })()
  }, [edit])

  useEffect(() => {
    createHostedFields()
  }, [braintreeClientToken])

  const saveCard = () => {
    hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
      if (tokenizeErr) {
        // error
        setErrorTips(tokenizeErr.message)
        return false
      }
      return payload
      // a
    })
    // hostedFieldsInstance.tokenize((tokenizeErr, payload) => {
    //   console.log(tokenizeErr, payload)
    // })
  }

  const options = {
    authorization: braintreeClientToken,
    styles: {
      input: {
        'font-size': '16px',
        'font-family': 'Courier New, Courier, monospace',
        'margin-bottom': '0',
        height: '44px'
      },
      // placeholder styles need to be individually adjusted
      '::-webkit-input-placeholder': {
        color: '#707070'
      },
      ':-moz-placeholder': {
        color: '#707070'
      },
      '::-moz-placeholder': {
        color: '#707070'
      },
      ':-ms-input-placeholder ': {
        color: '#707070'
      },
      ':hover': {
        borderBottom: '2px solid black'
      }
    },
    fields: {
      cardholderName: {
        container: '#cardholder-name',
        placeholder: 'Cardholder’s name'
      },
      number: {
        container: '#card-number',
        placeholder: 'Card Number'
      },
      cvv: {
        container: '#cvv',
        placeholder: 'CVV'
      },
      expirationDate: {
        container: '#expiration-date',
        placeholder: 'Expiry Date (MM/YY)'
      }
    }
  }

  const createHostedFields = () => {
    BraintreeWeb.hostedFields.create(options, function (hostedFieldsErr, hostedFieldsInstance) {
      if (hostedFieldsErr) {
        console.error(hostedFieldsErr)
        // handle error in hosted fields creation
        return
      }
      // let state = hostedFieldsInstance.getState()
      setHostedFieldsInstance(hostedFieldsInstance)

      hostedFieldsInstance.on('validityChange', (obj) => {
        setFieldsState(obj.fields)
      })

      hostedFieldsInstance.on('cardTypeChange', (obj) => {
        setUnsupportedCard(false)
        setIsUnsupportedCard(false)

        // This event is fired whenever a change in card type is detected.
        // It will only ever be fired from the number field.
        let cvvText
        // let cvvText, cvvSize, cardType, placeholder

        if (obj.cards.length === 1) {
          cvvText = obj.cards[0]?.code.name
          // cvvSize = obj.cards[0].code.size
          // cardType = obj.cards[0].niceType
          // placeholder = new Array(cvvSize + 1).join('*')
        } else {
          cvvText = 'CVV'
        }

        if (
          obj.cards[0]?.type !== 'visa' &&
          obj.cards[0]?.type !== 'master-card' &&
          obj.cards[0]?.type !== 'american-express'
        ) {
          setUnsupportedCard(true)
          setIsUnsupportedCard(true)
        }

        setCvv(cvvText)
      })

      // TO DO: Refactor logic when supportedCardTypes have been configured from braintree control panel
      // hostedFieldsInstance.getSupportedCardTypes().then(function (cardTypes) {
      //   cardTypes
      // })
    })
  }

  return (
    <div id='cardForm'>
      <FieldFormWrapper label={label} edit={edit} setEdit={setEdit} isEdit>
        {edit === 'Credit Card' ? (
          <div className={styles.formContentContainer}>
            {errorTips && (
              <Text block className={styles.error}>
                We could not add this card. Please try again later or contact support@bossjob.com
                for assistance if this issue persists.
              </Text>
            )}

            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <div id='cardholder-name' className={styles.hostedField} />
                <Text className={styles.errorField} textColor='red'>
                  {(fieldsState && fieldsState.cardholderName.isEmpty) ||
                  (fieldsState && fieldsState.cardholderName.isPotentiallyValid)
                    ? ''
                    : fieldsState &&
                      !fieldsState.cardholderName.isEmpty &&
                      !fieldsState.cardholderName.isValid
                    ? 'Invalid'
                    : ''}
                </Text>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <div
                  id='card-number'
                  className={unsupportedCard ? styles.hostedFieldUnsupported : styles.hostedField}
                />
                <Text className={styles.errorField} textColor='red'>
                  {unsupportedCard
                    ? 'We only accept Visa, MasterCard & AMEX'
                    : (fieldsState && fieldsState.number.isEmpty) ||
                      (fieldsState && fieldsState.number.isPotentiallyValid)
                    ? ''
                    : fieldsState && !fieldsState.number.isEmpty && !fieldsState.number.isValid
                    ? 'Invalid'
                    : ''}
                </Text>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={`${styles.formColumn} ${styles.columnMargin}`}>
                <div id='expiration-date' className={styles.hostedField} />
                <Text className={styles.errorField} textColor='red'>
                  {(fieldsState && fieldsState.expirationDate.isEmpty) ||
                  (fieldsState && fieldsState.expirationDate.isPotentiallyValid)
                    ? ''
                    : fieldsState &&
                      !fieldsState.expirationDate.isEmpty &&
                      !fieldsState.expirationDate.isValid
                    ? 'Invalid'
                    : ''}
                </Text>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <div id='cvv' className={styles.hostedField} />
                <Text className={styles.errorField} textColor='red'>
                  {(fieldsState && fieldsState.cvv.isEmpty) ||
                  (fieldsState && fieldsState.cvv.isPotentiallyValid)
                    ? ''
                    : fieldsState && !fieldsState.cvv.isEmpty && !fieldsState.cvv.isValid
                    ? 'Invalid'
                    : ''}
                </Text>
              </div>
            </div>

            <div className={styles.VerifyMailAndBindEmail_button}>
              <Button variant='contained' disabled={isBtnDisabled} onClick={saveCard}>
                Save
              </Button>
              <Button
                variant='outlined'
                onClick={() => {
                  setEdit(null)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </FieldFormWrapper>
    </div>
  )
}

export default React.memo(CreditCardFrom)
