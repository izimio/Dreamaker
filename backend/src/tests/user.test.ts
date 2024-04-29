import app from "../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { Server } from "http";
import { HDNodeWallet, ethers } from "ethers";
import { authWallet, fundDream } from "./utils/utils";
import { DEPLOYER_PRIVATE_KEY } from "../utils/config";

let request: supertest.SuperTest<supertest.Test> | undefined;
let server: Server | undefined;

beforeAll(async () => {
    server = app.listen();
    request = supertest(app);
    process.env.DEBUG = "";
});

afterAll(async () => {
    server?.close();
    mongoose.connection.close();
});

const ROUTE_GET_ME = "/user/me";
const ROUTE_FUNDED = "/user/me/funded";

describe(`GET ${ROUTE_GET_ME}`, () => {
    let adminSigner: {
        wallet: HDNodeWallet | ethers.Wallet;
        token: string;
    };

    beforeAll(async () => {
        adminSigner = await authWallet(request, DEPLOYER_PRIVATE_KEY);
    });

    it("Get me, admin", async () => {
        const response = await request
            ?.get(ROUTE_GET_ME)
            .set("Authorization", `Bearer ${adminSigner.token}`);
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data).toEqual({
            isAdmin: true,
            address: adminSigner.wallet.address,
            numberOfDMK: "100000.0",
            creation: response?.body.data.creation,
            actionHistory: response?.body.data.actionHistory,
        });
    });
    it("Get me, not admin", async () => {
        const randomGuy = await authWallet(request);
        const response = await request
            ?.get(ROUTE_GET_ME)
            .set("Authorization", `Bearer ${randomGuy.token}`);
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data).toEqual({
            isAdmin: false,
            address: randomGuy.wallet.address,
            numberOfDMK: "0.0",
            creation: response?.body.data.creation,
            actionHistory: response?.body.data.actionHistory,
        });
    });
    it("get me, Unauthorized", async () => {
        const response = await request?.get(ROUTE_GET_ME);
        expect(response?.status).toBe(401);
    });
});

describe(`GET ${ROUTE_FUNDED}`, () => {
    it("Get funded, OK", async () => {
        const me = await authWallet(request);
        const other = await authWallet(request);
        const turn = Math.floor(Math.random() * 5) + 1;

        let totalAmount: bigint = BigInt(0);
        const ids = [];

        for (let i = 0; i < turn; i++) {
            const { amount, dreamId } = await fundDream(request, {
                address: me.wallet.address,
            });
            totalAmount += amount;
            ids.push(dreamId);
        }
        await fundDream(request, {
            address: other.wallet.address,
            dreamId: ids[0],
            amount: BigInt(1),
        });

        const response = await request
            ?.get(ROUTE_FUNDED)
            .set("Authorization", `Bearer ${me.token}`);

        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data.amountFunded).toBe(
            ethers.formatEther(totalAmount)
        );
        expect(response?.body.data.fundedDreams.length).toBe(turn);

        const response2 = await request
            ?.get(ROUTE_FUNDED)
            .set("Authorization", `Bearer ${other.token}`);
        expect(response2?.status).toBe(200);
        expect(response2?.body.ok).toBe(true);
        expect(response2?.body.data.amountFunded).toBe(
            ethers.formatEther(BigInt(1))
        );
        expect(response2?.body.data.fundedDreams.length).toBe(1);
    }, 100000000);
    it("Get funded, Unauthorized", async () => {
        const response = await request?.get(ROUTE_FUNDED);
        expect(response?.status).toBe(401);
    });
});
