import axios from 'axios'

export default function userDetails(req, res) {
  const url = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'

  axios.get(url, { headers: { 'Authorization': `Bearer ${req.body.accessToken}`}})
    .then((response) => {
      res.send(response.data)
    })
    .catch(() => {

      res.status(401).json({ message: 'Invalid token' })
    })
}