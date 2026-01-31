import { unosend } from "../libs/unosend";

export const sendMagicLink = async ({
	email,
	url,
}: {
	email: string;
	url: string;
}) => {
	const { data, error } = await unosend.emails.send({
		from: "trektoeic@support.trektoeic.io.vn",
		to: email,
		subject: "Your Magic Link",
		html: `<p>Click the link below to log in:</p><a href="${url}">${url}</a>`,
	});

	if (error) {
		console.log(`Your mail url is ${url}`);
		console.error("Failed to send:", error.message);
		return null;
	}

	console.log("Email sent:", data?.id);
	return data;
};
