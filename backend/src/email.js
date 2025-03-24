import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nikhil2004akhil@gmail.com', // Replace with your Gmail address
    pass: 'Nikhil@123', // Replace with your Gmail App Password
  },
});

export const sendFraudAlertEmail = async (toEmail, accountDetails) => {
  const mailOptions = {
    from: 'nikhil2004akhil@gmail.com',
    to: toEmail,
    subject: 'Fraud Alert: Potential Fraud Detected',
    text: `Dear User,\n\nWe have detected potential fraud in your transaction.\nAccount Details: ${accountDetails}\nPlease review your account activity immediately.\n\nBest regards,\nFraud Shield Team`,
    html: `
      <h2>Fraud Alert</h2>
      <p>Dear User,</p>
      <p>We have detected potential fraud in your transaction.</p>
      <p><strong>Account Details:</strong> ${accountDetails}</p>
      <p>Please review your account activity immediately.</p>
      <p>Best regards,<br>Fraud Shield Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Fraud alert email sent to:', toEmail);
  } catch (err) {
    console.error('Error sending fraud alert email:', err);
  }
};