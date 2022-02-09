import axios from 'axios'
import queryString from 'query-string'

export default function accessToken(req, res) {
  /* Gets the Authorization code */
  const reqAuthCode = req.body.code
  const reqClientID = req.body.client_id
  const reqSecretID = req.body.client_secret

  /* Gets the Callback url */
  const reqCallbackUrl = req.body.redirect_uri

  /* Data to be sent as body to linkedin */
  const data = {
    grant_type: 'authorization_code',
    code: reqAuthCode,
    redirect_uri: reqCallbackUrl,
    client_id: reqClientID,
    client_secret: reqSecretID
  }
  const url = 'https://www.linkedin.com/oauth/v2/accessToken'

  axios.post(url, queryString.stringify(data))
    .then((response) => {
      const accessToken = response.data
      res.send(accessToken)
    })
}