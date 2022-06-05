import axios from 'axios'

export default function userDetails(req, res) {
  const url = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'

  axios.get(url, { headers: { 'Authorization': `Bearer ${req.query.accessToken}`}})
    .then((response) => {
      const dataFormat = response.data
      const linkedinData = JSON.parse(dataFormat)
      res.send(linkedinData)
    })
}