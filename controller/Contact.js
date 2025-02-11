const Contact = require('../model/Contact');
const sendMail = require('../utils/sendMail');

const contactForm = async (req, res) => {
  try {
    const response = req.body;
    
    // Create the contact record
    const newContact = await Contact.create(response);
    
    // Send email using the newly created contact's data
    await sendMail({
      email: newContact.email,
      subject: `Your Inquiry Has Been Received!`,
      message: `<p>Dear ${newContact.username},</p> <br/>
        
      <p>Thank you for reaching out to us. We have received your query and appreciate your interest in our products.</p>

        <p>Our team is currently reviewing your message and will respond to you as soon as possible. Please expect a reply within a hours.</p>

        <p>If you have any additional information to provide or further questions, please feel free to reply to this email. We are here to assist you and look forward to helping resolve your query.</p>

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
};

module.exports = contactForm;
