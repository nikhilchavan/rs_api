const axios = require('axios')
const https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";

const nikhil_test = 'cHZfNzEyOTI0YjliMzlkNDg0ZWJmOTc3YTBjZjQyNWI1YzI=';
const nikhil_test2 = 'cHZfNzVhM2E1N2E3Zjk4NDJiMDllZjdkZDI2M2JjMzg0ODQ=';
const config = {
    headers: {
      'Authorization' : `Basic ${nikhil_test}`
    }
}
const post_data = {
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
const reusable_template_url = 'https://api.rs.dev:3002/public/v1/reusable_templates/28ba58ab-8ad3-434f-900e-1a75fbb21117/send_document';
let count = 0;

function request() {
    count++;
    axios.post(
        reusable_template_url,
        post_data,
        config,
        { httpsAgent : new https.Agent({ rejectUnauthorized: false }) }
    )
    .then((res) => {
      console.log(`${count} statusCode: ${res.status}`);
    })
    .catch((error) => {
      console.log(error.response.status, error.response.data.error);
    })
}

let interval = setInterval(request, 1000);
