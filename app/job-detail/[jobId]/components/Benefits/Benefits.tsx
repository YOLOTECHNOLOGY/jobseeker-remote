import Button from '@mui/material/Button'

type propsType = {
  benefits?: Array<any>
}

const Benefits = ({ benefits }: propsType) => {
  return (
    <div>
      <h2>Benefits</h2>
      <div>
        {benefits.map((benefit) => (
          <Button key={benefit.id}>{benefit.name}</Button>
        ))}
      </div>
      <div>See more</div>
    </div>
  )
}

export default Benefits
