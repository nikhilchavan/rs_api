const axios = require('axios')
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";

const clientApp1 = 'cHZfNzEyOTI0YjliMzlkNDg0ZWJmOTc3YTBjZjQyNWI1YzI=';
const clientApp2 = 'cHZfNzVhM2E1N2E3Zjk4NDJiMDllZjdkZDI2M2JjMzg0ODQ=';
const config = {
    headers: {
      'Authorization' : `Basic ${clientApp1}`
    }
}
const reusableTemplateData = {
    "message": "Please sign this",
    "expires_in": 30,
    "roles": [
      {
        "name": "signer1",
        "signer_email": "nikhil@grr.la",
        "signer_name": "nikhil"
      }
    ],
    "name": "This is the name of a document"
};
const sendingRequestData = {
    "file": {
      "name": "my_upload.pdf",
      "source": "upload"
    },
    "document": {
      "signer_sequencing": false,
      "expires_in": 12,
      "name": "Sign me",
      "roles": [
        {
            "name": "a",
            "signer_name": "Foo B",
            "signer_email": "foo@bar.com"
        }
      ]
    },
    "sending_request": {}
}
const reusableTemplateId = '28ba58ab-8ad3-434f-900e-1a75fbb21117';
const reusableTemplateUrl = `https://api.rs.dev:3002/public/v1/reusable_templates/${reusableTemplateId}/send_document`;
const sendingRequestUrl = 'https://api.rs.dev:3002/public/v1/sending_requests/';
let count = 0;

//public/v1/reusable_templates/:id/send_document
function sendDocument() {
    count++;
    axios.post(
        reusableTemplateUrl,
        reusableTemplateData,
        config,
        { httpsAgent : new https.Agent({ rejectUnauthorized: false }) }
    )
    .then((res) => {
        console.log(`${count} statusCode: ${res.status}`);
    })
    .catch(error => console.log(error.response.status, error.response.data.error))
}

async function uploadAndProcess(documentInfo) {
    try {
        await axios.put(documentInfo.upload_url, 'Dummy Content');
        await axios.post(`https://api.rs.dev:3002/public/v1/sending_requests/${documentInfo.id}/uploaded`, 
            {}, 
            config, 
            { httpsAgent : new https.Agent({ rejectUnauthorized: false }) }
        );
        console.log("Document Sent");
    } catch(e) {
        console.log(e);
    }
}
//public/v1/sending_requests/:id
function sendRequest() {
    count++;
    axios.post(
        sendingRequestUrl,
        sendingRequestData,
        config,
        { httpsAgent : new https.Agent({ rejectUnauthorized: false }) }
    )
    .then(res => uploadAndProcess(res.data.sending_request))
    .catch(error => console.log(error.response.status, error.response.data.error));
}

//sendDocument();
sendRequest();