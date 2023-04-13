import { describe, expect, it } from "vitest";
import { config } from "dotenv";
import { generateLogs } from "../modules/GenerateLogs.js";

describe("generateLogs", () => {
    config()

    const USER_ID = "1234567890";
    const BOT_ID = process.env.BOT_ID;

    it("should return an array", () => {
        const prev_messages = [];
        const result = generateLogs(prev_messages, USER_ID);
        expect(result).toBeInstanceOf(Array);
    });

    it("should return an array with a system message", () => {
        const prev_messages = [];
        const expected_logs = [ 
            { role: "system", content: "You are a friendly robot" },
        ];
        expect(generateLogs(prev_messages, USER_ID)).toEqual(expected_logs);
    });

    it("should return an array with a system message and a user message", () => {
        const prev_messages = [
            { author: {id: USER_ID} , content: "Hello, bot!" },
        ];
        const expected_logs = [ 
            { role: "system", content: "You are a friendly robot" },
            { role: "user", content: "Hello, bot!" },
        ];

        expect(generateLogs(prev_messages, USER_ID)).toEqual(expected_logs);
    });

    it("should return an array with a system message, a user message and a bot message", () => {
        const prev_messages = [
            { author: {id: USER_ID} , content: "Hello, bot!" },
            { author: {id: BOT_ID} , content: "Hello, user!" }
        ];
        prev_messages.reverse();

        const expected_logs = [
            { role: "system", content: "You are a friendly robot" },
            { role: "user", content: "Hello, bot!" },
            { role: "bot", content: "Hello, user!" }
        ];

        expect(generateLogs(prev_messages, USER_ID)).toEqual(expected_logs);
    });

    it("should clean the conversation when !clean is received", () => {
        const prev_messages = [
            { author: {id: USER_ID} , content: "Hello, bot!" },
            { author: {id: BOT_ID} , content: "Hello, user!" },
            { author: {id: USER_ID} , content: "!clean" },
            { author: {id: USER_ID} , content: "Hello, bot!" },
            { author: {id: BOT_ID} , content: "Hello, user!" }
        ];
        prev_messages.reverse();

        const expected_logs = [
            { role: "system", content: "You are a friendly robot" },
            { role: "user", content: "Hello, bot!" },
            { role: "bot", content: "Hello, user!" }
        ];

        expect(generateLogs(prev_messages, USER_ID)).toEqual(expected_logs);
    });

    it("should change the mode when !mode is received", () => {
        const prev_messages = [
            { author: {id: USER_ID} , content: "Hello, bot!" },
            { author: {id: BOT_ID} , content: "Hello, user!" },
            { author: {id: USER_ID} , content: "!clean" },
            { author: {id: USER_ID} , content: "!mode serious" },
            { author: {id: USER_ID} , content: "Hello, bot!" },
            { author: {id: BOT_ID} , content: "Hello, user!" }
        ];
        prev_messages.reverse();

        const expected_logs = [
            { role: "system", content: "You are a serious robot" },
            { role: "user", content: "Hello, bot!" },
            { role: "bot", content: "Hello, user!" }
        ];

        expect(generateLogs(prev_messages, USER_ID)).toEqual(expected_logs);
    });

});