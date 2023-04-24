import axios from 'axios'

export default function userEmail(req, res) {
  const url = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))'

  axios.get(url, { headers: { 'Authorization': `Bearer ${req.body.accessToken}`}})
    .then((response) => {
      res.send(response.data)
    })
    .catch(error => {
      console.error(error)

      res.status(401).json({ message: 'Invalid token' })
    })
}