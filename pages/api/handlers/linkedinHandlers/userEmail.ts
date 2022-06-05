import axios from 'axios'

export default function userEmail(req, res) {
  const url = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))'

  axios.get(url, { headers: { 'Authorization': `Bearer ${req.query.accessToken}`}})
    .then((response) => {
      const dataFormat = response.data
      const linkedinData = JSON.parse(dataFormat)
      res.send(linkedinData)
    })
}