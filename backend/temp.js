import dotenv from 'dotenv';
dotenv.config({ path: './.env.test'})

console.log(process.env.MONGODB_CONNECT_KEY);