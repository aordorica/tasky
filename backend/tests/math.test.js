import { expect } from "@jest/globals";
import dotenv from 'dotenv'
dotenv.config({path: './.env.test'})

test('should pass', () => {
    expect(1).toBe(1)
})
