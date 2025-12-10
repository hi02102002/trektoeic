import { env } from "@trektoiec/env";
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	host: "smtp.unosend.co",
	port: 587,
	secure: false,
	auth: {
		user: "unosend",
		pass: env.UNOSEND_API_KEY,
	},
});
