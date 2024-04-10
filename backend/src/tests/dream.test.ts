import app from "../app";
import supertest from "supertest";
import { Server } from "http";
import mongoose from "mongoose";
import { HDNodeWallet, ethers } from "ethers";
import {
    authWallet,
    createRandomDream,
    createRandomDreamData,
} from "./utils/utils";
import { DreamModel } from "../models/dreamModel";

let request: supertest.SuperTest<supertest.Test> | undefined;
let server: Server | undefined;

beforeAll(async () => {
    process.env.DEBUG = "";
    server = app.listen();
    request = supertest(app);
});

afterAll(async () => {
    server?.close();
    mongoose.connection.close();
});

const ROUTE_CREATE_DREAM = "/dream";
const ROUTE_GET_DREAMS = "/dream";

const ROUTE_GET_MY_DREAMS = "/dream/me";

const ROUTE_UPDATE_DREAM = "/dream/:id";

describe(`POST ${ROUTE_CREATE_DREAM}`, () => {
    it("Create dream, OK", async () => {
        await createRandomDream(request, undefined, {});
    });
    it("Create dream, Unauthorized", async () => {
        const { title, description, tags, deadlineTime, targetAmount } =
            createRandomDreamData();
        const response = await request
            ?.post(ROUTE_CREATE_DREAM)
            .set("Authorization", `Bearer invalid token`)
            .field("title", title)
            .field("description", description)
            .field("tags", tags.join(","))
            .field("deadlineTime", deadlineTime)
            .field("targetAmount", targetAmount);

        expect(response?.status).toBe(401);
        expect(response?.body.ok).toBe(false);
    });
    it("Create dream, missing title", async () => {
        const signer = await authWallet(request);
        const { description, tags, deadlineTime, targetAmount } =
            createRandomDreamData();
        const response = await request
            ?.post(ROUTE_CREATE_DREAM)
            .set("Authorization", `Bearer ${signer.token}`)
            .field("description", description)
            .field("tags", tags.join(","))
            .field("deadlineTime", deadlineTime)
            .field("targetAmount", targetAmount);

        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Create dream, missing description", async () => {
        const signer = await authWallet(request);
        const { title, tags, deadlineTime, targetAmount } =
            createRandomDreamData();
        const response = await request
            ?.post(ROUTE_CREATE_DREAM)
            .set("Authorization", `Bearer ${signer.token}`)
            .field("title", title)
            .field("tags", tags.join(","))
            .field("deadlineTime", deadlineTime)
            .field("targetAmount", targetAmount);

        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Create dream, no-sens Tags", async () => {
        const signer = await authWallet(request);
        const { title, description, deadlineTime, targetAmount } =
            createRandomDreamData();
        const response = await request
            ?.post(ROUTE_CREATE_DREAM)
            .set("Authorization", `Bearer ${signer.token}`)
            .field("title", title)
            .field("description", description)
            .field("tags", "no-sens")
            .field("deadlineTime", deadlineTime)
            .field("targetAmount", targetAmount);

        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Create dream, wrong deadlineTime", async () => {
        const signer = await authWallet(request);
        const { title, description, tags, targetAmount, deadlineTime } =
            createRandomDreamData();
        const response = await request
            ?.post(ROUTE_CREATE_DREAM)
            .set("Authorization", `Bearer ${signer.token}`)
            .field("title", title)
            .field("description", description)
            .field("tags", tags.join(","))
            .field("deadlineTime", deadlineTime - 3600 * 365)
            .field("targetAmount", targetAmount);

        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Create dream, wrong targetAmount", async () => {
        const signer = await authWallet(request);
        const { title, description, tags, deadlineTime } =
            createRandomDreamData();
        const response = await request
            ?.post(ROUTE_CREATE_DREAM)
            .set("Authorization", `Bearer ${signer.token}`)
            .field("title", title)
            .field("description", description)
            .field("tags", tags.join(","))
            .field("deadlineTime", deadlineTime)
            .field("targetAmount", "0");

        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
});
