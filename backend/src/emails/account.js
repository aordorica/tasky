import sendGrid from '@sendgrid/mail';
import { env } from 'process';
import path from 'path';
import dotenv from "dotenv";
// dotenv.config({ path: "../../.env.dev" });

sendGrid.setApiKey(env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sendGrid.send({
        to: email,
        from: {
            email: 'alan@alanordorica.com',
            name: 'Alan Ordorica'
        },
        subject: 'Thanks for joining!',
        text: `Welcome to Tasky ${name}! Please enjoy the app and let me know your thoughts.`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sendGrid.send({
        to: email,
        from: {
            email: "alan@alanordorica.com",
            name: "Alan Ordorica",
        },
        fromname: "Alan Ordorica",
        subject: "Sorry to see you go!",
        text: `Thanks for being a part of the team ${name}. I hope to see you again soon!`,
    });
}

export {
    sendWelcomeEmail,
    sendGoodbyeEmail
}

