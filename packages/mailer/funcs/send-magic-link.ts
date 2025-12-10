import { transporter } from "../libs/transporter";

export const sendMagicLink = async ({
	email,
	url,
}: {
	email: string;
	url: string;
}) => {
	try {
		const res = await transporter.sendMail({
			from: "hoanghuy.dev0210@gmail.com",
			to: email,
			subject: "Your Magic Link",
			html: `<p>Click the link below to log in:</p><a href="${url}">${url}</a>`,
		});

		console.log("Successfully sent magic link via SMTP:", res.messageId);

		return res;
	} catch (smtpError) {
		console.error("SMTP send failed, attempting via Unosend:", smtpError);
	}
};
