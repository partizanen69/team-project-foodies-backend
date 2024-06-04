import { createTransport } from 'nodemailer';

const transporter = createTransport({
  host: 'smtp.ukr.net',
  port: 465,
  secure: true,
  auth: {
    user: 'oleksii.ablitsov@ukr.net',
    pass: process.env.UKR_NET_EMAL_PASSWORD,
  },
});

export const sendVerificationEmail = async ({ emailTo, verificationToken }) => {
  const verificationLink = `http://localhost:3000/api/users/verify/${verificationToken}`;

  await transporter.sendMail({
    from: 'oleksii.ablitsov@ukr.net',
    to: emailTo,
    subject: 'Confirm you email',
    html: `Please confirm you email by <a href="${verificationLink}" target="blank">clicking here</a>`,
  });
};
