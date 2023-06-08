import React from "react"
import Text from 'components/Text'

const errorText = (errorMessage:string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='span' >
        {errorMessage}
      </Text>
    )
  }
  export default errorText