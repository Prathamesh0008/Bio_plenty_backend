const nodemailer = require("nodemailer");
const sendMail = require("../utils/sendMail");

// Initialize transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

exports.sendMail = async function ({ to, subject, text, html }) {
  try {
    let info = await transporter.sendMail({
      to,
      subject,
      text,
      html,
    });
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

exports.invoiceTemplate = function (newContact) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accepted your Query</title>
      <style>
        /* Your CSS styles here */
      </style>
    </head>
    <body>
      <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1; color: #fff; opacity: 0;">
        Your inquiry is important to us. Expect a response shortly.
      </div>

      <div style="width: 100%; display: flex; justify-content: center; align-items: center; padding: 30px 0;">
        <div style="box-shadow: 0px 12px 28px 0px rgba(140, 149, 159, 0.3); max-width: 680px; margin-top: 30px; border-radius: 8px; padding: 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="left" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0;">
                        Dear Dinkar,
                      </p>
                      <p>Thank you for reaching out to us. We have received your query and appreciate your interest in our services/products.</p>
                      <p>Our team is currently reviewing your message and will respond to you as soon as possible. Please expect a reply within a few hours.</p>
                      <p>If you have any additional information to provide or further questions, please feel free to reply to this email. We are here to assist you and look forward to helping resolve your query.</p>
                      <p>Best regards,</p>
                      <p>Support Team <br />
                        bioplentypeps Pvt Ltd <br />
                        info@bioplentypeps.com
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 24px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="center" style="background-color: #4a9e4a; padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #fff;">
                      <p style="margin: 0;">
                        You received this email because we received a support request. If you didn't make this request, you can safely delete this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 12px 24px; background-color: #4a9e4a; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #fff;">
                      <p style="margin: 0;">
                        Suite 403, Aventura, Florida, 33180, US
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </body>
  </html>
  `;
};
