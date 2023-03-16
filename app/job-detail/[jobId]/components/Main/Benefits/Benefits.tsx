'use client'
import Button from '@mui/material/Button'

type propsType = {
  benefits?: Array<any>
}

const Benefits = ({ benefits }: propsType) => {
  return (
    <section>
      <h2>Benefits</h2>
      <Button></Button>
      <div>
        {benefits?.map((benefit) => (
          <Button key={benefit.id}>{benefit.name}</Button>
        ))}
      </div>
      <div>See more</div>
    </section>
  )
}

export default Benefits
