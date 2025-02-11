const nodemailer = require("nodemailer");
const sendMail = require("../utils/sendMail");

// Initialize transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMPT_HOST,
  port: process.env.SMPT_PORT,
  service: process.env.SMPT_SERVICE,
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
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
    throw new Error("Failed to send email");
  }
};

exports.invoiceTemplate = function (order) {
  const totalPrice = order.totalPrice;
  const deliveryAddress = order.shippingAddress;
  const orderedItems = order.cart;

  // Calculate total quantity
  const totalQuantity = orderedItems.reduce((acc, item) => acc + item.qty, 0);

  // Format ordered items
  let itemsHtml = "";
  orderedItems.forEach((item) => {
    itemsHtml += `
      <tr>
        <td align="left" width="60%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 24px;">${item.name}</td>
        <td align="left" width="60%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 24px;">${item.qty}</td>
        <td align="left" width="60%" style="padding: 6px 12px;font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 24px;">$${item.discountPrice}</td>
      </tr>
    `;
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Receipt</title>
  </head>
  <body>
    <!-- Your HTML content here -->
    <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1; color: #fff; opacity: 0;">
      Your order is confirmed! Track it now and see delivery details.
    </div>

    <div align="center" style="border-radius: 8px; padding: 10px; width: 97%; background-color: rgb(231, 231, 231); padding: 30px 0;">

      <div style="box-shadow: 0px 12px 28px 0px rgba(175, 175, 175, 0.3); text-align: start; background-color: white; max-width: 680px; margin-top: 30px; border-radius: 8px; padding: 20px;">

        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="center" valign="top" style="padding: 10px 24px;">
                    <a href="/" target="_blank" style="display: inline-block;">
                      <img src="https://github.com/Dinkar20001/for-image/assets/169672358/e1342927-9fe7-41d5-80a6-09552f921a7b" alt="Logo" border="0" style="display: block; width: 150px; max-width: 150px;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                    <h1 style="margin: 0; font-size: 32px; color: #4a9e4a !important; font-weight: 700; letter-spacing: -1px; line-height: 48px;">
                      Thank you for your order!
                    </h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
              
                <tr>
                  <td align="left" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <p style="margin: 0;">
                      Here is a summary of your recent order. If you have any
                      questions or concerns about your order, please
                      <a href="https://www.bioplentypeps.com/contact-us" target="_blank">contact us</a>.
                    </p>
                       <p>And you can easily track your order through the <a href="https://www.bioplentypeps.com/profile">Profile</a> section.</p>
                  </td>
                </tr>

                <tr>
                  <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="left" width="60%" style="border-top-left-radius: 10px; border-bottom-left-radius: 10px; background-color: #4a9e4a; color: white; padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                          <strong>Order #</strong>
                        </td>
                        <td align="left" width="20%" style="background-color: #4a9e4a; color: white; padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>Item Qty<strong />
                        </td>
                        <td align="left" width="20%" style="border-top-right-radius: 10px; border-bottom-right-radius: 10px; padding: 12px; background-color: #4a9e4a; color: white; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;"><strong>${order?.id ? order.id.slice(0, 8) : ''}</strong></td>
                      </tr>

                      ${itemsHtml}

                      <tr>
                        <td align="left" width="60%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #d2c7ba; border-bottom: 2px dashed #d2c7ba;"><strong>Total</strong></td>
                        <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #d2c7ba; border-bottom: 2px dashed #d2c7ba;"><strong>${totalQuantity}</strong></td>
                        <td align="left" width="20%" style="padding: 12px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-top: 2px dashed #d2c7ba; border-bottom: 2px dashed #d2c7ba;"><strong>$ ${totalPrice}</strong></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" valign="top" width="100%">
              <table align="center" bgcolor="#ffffff" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tr>
                  <td valign="top" style="align-Items: end, font-Family: Source Sans Pro, Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; text-align: end">
                    <div style="text-align: start; padding: 0 20px">
                      <p><strong>Delivery Address</strong></p>
                      <ul>
                        <p>${deliveryAddress.address1}<br />${deliveryAddress.address2}<br />
                        ${deliveryAddress.city}, ${deliveryAddress.country} <br /> 
                        ${deliveryAddress.zipCode}
                        </p>
                      </ul>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding: 24px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                <tr>
                  <td align="center" style="border-top-left-radius: 10px; border-top-right-radius: 10px; background-color: #4a9e4a; padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px;">
                    <p style="margin: 0; color: #fff;">
                      You received this email because we received a request for
                      Order Delivered for your account. If you didn't request
                      then you can safely delete this email.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; padding: 12px 24px; background-color: #4a9e4a; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #fff;">
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
