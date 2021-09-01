import supertest from 'supertest';
// import { expect } from "@jest/globals";
// import 'dotenv/config'
// import dotenv from "dotenv";
// dotenv.config({ path: "./.env.test" });

console.log(process.env.MONGODB_CONNECT_KEY);
console.log(process.env.JWT_SECRET);

test('should pass', () => {
    expect(1).toBe(1)
})
