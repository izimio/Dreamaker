import app from "../app";
import supertest from "supertest";
import { Server } from "http";
import mongoose from "mongoose";

let request: supertest.SuperTest<supertest.Test> | undefined;
let server: Server | undefined;

beforeAll(async () => {
    server = app.listen();
    request = supertest(app);
});

afterAll(async () => {
    server?.close();
    mongoose.connection.close();
});

describe("POST auth/challenge", () => {
    it("should return 200", async () => {
        const response = await request?.post("/auth/challenge").send({
            address: "0x1234567890123456789012345678901234567890",
        });
        expect(response?.status).toBe(201);
    });

});