import app from "../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { Server } from "http";
import { HDNodeWallet, ethers } from "ethers";
import { authWallet } from "./utils/utils";
import { Watcher } from "../Watchers/Watch";
import { SyncronInstance } from "../syncron/Syncron";

let request: supertest.SuperTest<supertest.Test> | undefined;
let server: Server | undefined;

beforeAll(async () => {
    server = app.listen();
    request = supertest(app);
    process.env.DEBUG = "";
    SyncronInstance.stop();
});

afterAll(async () => {
    server?.close();
    mongoose.connection.close();
    Watcher.stop();
});

const ROUTE_CHALLENGE = "/auth/challenge";
const ROUTE_VERIFY = "/auth/verify";

describe("POST auth/challenge", () => {
    let randomWallet: HDNodeWallet | ethers.Wallet;
    beforeEach(() => {
        randomWallet = ethers.Wallet.createRandom();
    });

    it("Creating a challenge, OK", async () => {
        const response = await request?.get(
            ROUTE_CHALLENGE + `/${randomWallet.address}`
        );
        expect(response?.status).toBe(201);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data.challenge).toBeDefined();
    });
    it("Creating a challenge, invalid address", async () => {
        const response = await request?.get(
            ROUTE_CHALLENGE + "/invalid address"
        );
        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
});

describe("POST auth/verify", () => {
    let randomWallet: HDNodeWallet | ethers.Wallet;
    let challenge: string;

    async function createRandomChallenge(address?: string) {
        const addressToUse = address || randomWallet.address;
        const response0 = await request?.get(
            ROUTE_CHALLENGE + `/${addressToUse}`
        );
        expect(response0?.status).toBe(201);
        expect(response0?.body.ok).toBe(true);
        expect(response0?.body.data.challenge).toBeDefined();
        return response0?.body.data.challenge;
    }

    beforeEach(() => {
        randomWallet = ethers.Wallet.createRandom();
    });
    it("Verifying a challenge, auto-func", async () => {
        await authWallet(request);
    });
    it("Verifying a challenge, OK", async () => {
        challenge = await createRandomChallenge();
        const signature = await randomWallet.signMessage(challenge);

        const response = await request?.post(ROUTE_VERIFY).send({
            address: randomWallet.address,
            signature: signature,
        });
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data.token).toBeDefined();
    });
    it("Verifying a challenge, missing address", async () => {
        const challenge = await createRandomChallenge();

        const signature = await randomWallet.signMessage(challenge);

        const response = await request?.post(ROUTE_VERIFY).send({
            signature: signature,
        });
        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Verifying a challenge, missing signature", async () => {
        await createRandomChallenge();

        const response = await request?.post(ROUTE_VERIFY).send({
            address: randomWallet.address,
        });
        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Verifying a challenge, invalid signature", async () => {
        await createRandomChallenge();

        const response = await request?.post(ROUTE_VERIFY).send({
            address: randomWallet.address,
            signature: "invalid signature",
        });
        expect(response?.status).toBe(401);
        expect(response?.body.ok).toBe(false);
    });
    it("Verifying a challenge, invalid address", async () => {
        const challenge = await createRandomChallenge();

        const signature = await randomWallet.signMessage(challenge);

        const response = await request?.post(ROUTE_VERIFY).send({
            address: "invalid address",
            signature: signature,
        });
        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Verifying a challenge, challenge not found", async () => {
        const signature = await randomWallet.signMessage("challenge");

        const response = await request?.post(ROUTE_VERIFY).send({
            address: randomWallet.address,
            signature: signature,
        });
        expect(response?.status).toBe(404);
        expect(response?.body.ok).toBe(false);
    });
    it("Verifying a challenge, Invalid but coherent sig", async () => {
        challenge = await createRandomChallenge();
        const randomWallet2 = ethers.Wallet.createRandom();
        const signature = await randomWallet2.signMessage(challenge);

        const response = await request?.post(ROUTE_VERIFY).send({
            address: randomWallet.address,
            signature: signature,
        });
        expect(response?.status).toBe(401);
        expect(response?.body.ok).toBe(false);
    });
});
