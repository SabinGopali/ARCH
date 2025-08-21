import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const fromEmail = process.env.FROM_EMAIL || 'no-reply@example.com';

let transporter;

export function getEmailTransporter() {
	if (transporter) return transporter;
	transporter = nodemailer.createTransport({
		host: smtpHost,
		port: smtpPort,
		secure: smtpPort === 465,
		auth: { user: smtpUser, pass: smtpPass },
	});
	return transporter;
}

export async function sendVerificationOtpEmail({ to, otp, username }) {
	const transport = getEmailTransporter();
	const subject = 'Verify your email - Archphaze';
	const html = `
		<div style="font-family: Arial, sans-serif; line-height: 1.6;">
			<h2>Hi ${username || 'there'},</h2>
			<p>Use the following One-Time Password (OTP) to verify your email address:</p>
			<div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 12px 16px; background: #f4f4f4; display: inline-block; border-radius: 8px;">${otp}</div>
			<p>This code will expire in 10 minutes.</p>
			<p>If you did not request this, you can safely ignore this email.</p>
			<p>— Archphaze Team</p>
		</div>
	`;
	await transport.sendMail({ from: fromEmail, to, subject, html });
}