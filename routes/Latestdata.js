const express = require("express");
const LatestData = require("../model/Latestdata");
const sendMail = require("../utils/sendMail");
const router = express.Router();

router.route("/latestdata").post(async (req, res) => { // Added async handler
  try {
    const response = req.body;
    const latestdata = await LatestData.create(response);

    await sendMail({
        email: latestdata.email,
        subject: `Welcome! 🎉 Be the First to Know About Our Latest Updates`,
        message: `
          
        <p>Welcome to our community! 🎉 We're thrilled to have you on board and are excited to keep you in the loop with all the latest and greatest updates from our world.</p>
      
          <p>As a valued subscriber, you'll be the first to know about:</p>
      
          <p>🛍️ Exclusive Sales and Offers: Get the best deals and special promotions before anyone else.</p>
          <p>🎟️ Upcoming Events: Be the first to hear about exciting events and opportunities.</p>
          <p>📰 Latest News and Updates: Stay informed with our latest announcements and stories.</p>

          <p>We value your time and your inbox, so rest assured, we’ll only send you the most important updates.</p>
      
          <br/>
          
          <p>Best regards,</p> <br/>
      
          <p>bioplentypeps Pvt Ltd</p>
          <p>support@bioplentypeps.com</p>
          <p>www.bioplentypeps.com</p>
      
          `,
      });
    return res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Message not delivered" });
  }
});

module.exports = router;
