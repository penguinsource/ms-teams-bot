const fetch = require('node-fetch')

const clientid = '66ccd97c-e2af-49be-be68-2e9134c5db66';
const clientsecret = 'rg536lAIILq6I3bjdi57qDk8-2_SY~_-c_';

const botId ='28:66ccd97c-e2af-49be-be68-2e9134c5db66'
const botName = 'GSB Ngrok 5'

const userId = '29:18-jVX_tICg2oyrqOJdSnAzgQD-G2kzGaz12lOxtoZf_CZJ-c3RFfU0GxkpTH94KeAuYrz4pmD7nK0VKZM8C9kg'
const userName = 'Mihai Oprescu'

const tenantId = "abaf94be-b9bd-4ae3-a35d-84f393cea8dc"

const serviceUrl = 'https://smba.trafficmanager.net/apis'

const getToken = async () => {
  const defaultScope = 'https://api.botframework.com/.default'
  const params = `grant_type=client_credentials&client_id=${clientid}&client_secret=${clientsecret}&scope=${defaultScope}`
  const response = await fetch(`https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token`, {
    method: 'POST',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
  const resp = await response.json()
  return resp.access_token
}

const sendMessage = async (access, conversationId) => {
  const requestData = {
    "type": "message",
    "from": {
      "id": botId,
      "name": botName
    },
    "conversation": {
      "id": conversationId,
    },
    "recipient": {
      "id": userId,
      "name": userName,
    },
    "text": "Helloooooooooooooooo",
  }

  console.log('sendMessage request data:', requestData)

  const response = await fetch(`${serviceUrl}/v3/conversations/${conversationId}/activities/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${access}`
      },
      body: JSON.stringify(requestData)
    });
  const sendMessageResponse = await response.json()
  console.log('Send message response:', sendMessageResponse)
}

const createConversation = async () => {
  let access = await getToken()
  const resp = await fetch(`${serviceUrl}/v3/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${access}`
    },
    body: JSON.stringify({
        "bot": {
          "id": botId,
          "name": botName
        },
        "isGroup": false,
        "tenantId": tenantId,
        "members": [
          {
            "id": userId,
            "name": userName
          }
        ]
    })
  });
  const response = await resp.json();
  const { id: conversationId } = response
  return conversationId
}

const run = async () => {
  let access = await getToken()
  const conversationId = await createConversation();
  const response = await sendMessage(access, conversationId)
}


run()
