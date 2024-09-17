// 'use strict';
import nodemailer from "nodemailer";
import fs from "fs";
import CONFIG from "../config/config.js";
import settings from "../config/emailSettings.js";

const template = fs.readFileSync(
	CONFIG.BASE + "Templates/email.html",
	"utf8"
);

let transporter = nodemailer.createTransport({
	host: settings.smtpServer,
	port: settings.smtpPort,
	secure: settings.smtpSecure, // true for 465, false for other ports
	auth: {
		user: settings.smtpUsername, // generated ethereal user
		pass: settings.smtpPassword, // generated ethereal password
	},
});


type MailInput = {
	recipients: string;
	subject: string;
	message: string;
	attachment?: any[];
};

// async..await is not allowed in global scope, must use a wrapper
async function SendMail(input: MailInput) {
	// create reusable transporter object using the default SMTP transport

	// try {
	// send mail with defined transport object
	const obj: Record<string, any> = {
		from: `${settings.smtpName} <${settings.smtpFrom}>`, // sender address
		to: input.recipients, // list of receivers
		subject: input.subject, // Subject line
		html: template
			.split("[message]")
			.join(input.message),
	};
	if (input.attachment) {
		obj.attachments = input.attachment;
	  }
	await transporter.sendMail(obj);
	return true;
}

export default SendMail;
