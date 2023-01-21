import SES from "aws-sdk/clients/ses.js";

const client = new SES({
  region: "us-east-1",
});

export const send = async (token, user) => {
  await client
    .sendEmail({
      Source: "Ideve Core <ideve.core@gmail.com>",
      Destination: {
        ToAddresses: [`${user.first_name} ${user.last_name} <${user.email}>`],
      },
      Message: {
        Subject: {
          Data: "Validate email",
        },
        Body: {
          Html: {
            Data: `
              <p>Hello, we are the Ideve Core team, We have received a request for registration on our platform, if you have requested it, visit the link to continue the registration.</p>
              <a href="http://localhost:5173/validate_email?token=${token}">http://localhost:5173/validate_email?token=${token}</a>
              <p>Link expires in 5 (five) minutes.</p>
            `
          }
        },
      },
      ConfigurationSetName: "auth",
    })
    .promise();
}