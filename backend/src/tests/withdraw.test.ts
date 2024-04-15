import app from "../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { Server } from "http";
import { HDNodeWallet, ethers } from "ethers";
import { authWallet, createRandomDream } from "./utils/utils";
import { DreamModel, DreamStatus } from "../models/dreamModel";
import { DEPLOYER_PRIVATE_KEY } from "../utils/config";
import * as withdrawServices from "../services/withdraw";
import { Forbidden } from "../utils/error";

let request: supertest.SuperTest<supertest.Test> | undefined;
let server: Server | undefined;

const MAX_AMOUNT = ethers.parseEther(Math.round(Math.random() * 10).toString());

jest.spyOn(withdrawServices, "getBalance").mockImplementation(async () => {
    return Promise.resolve(ethers.formatEther(MAX_AMOUNT));
});

jest.spyOn(withdrawServices, "withdraw").mockImplementation(
    async (to: string, amount: string = "") => {
        to = to;
        if (amount && MAX_AMOUNT < ethers.parseUnits(amount, "wei")) {
            throw new Forbidden("Insufficient balance in proxy contract");
        }
        if (!amount) {
            return Promise.resolve({
                status: "success",
                amount: ethers.formatEther(MAX_AMOUNT),
            });
        }
        return Promise.resolve({
            status: "success",
            amount: ethers.formatEther(amount),
        });
    }
);

beforeAll(async () => {
    server = app.listen();
    request = supertest(app);
    process.env.DEBUG = "";
});

afterAll(async () => {
    server?.close();
    mongoose.connection.close();
});

const ROUTE_GET_BALANCE = "/withdraw";
const ROUTER_WITHDRAW = "/withdraw";

describe(`GET ${ROUTE_GET_BALANCE}`, () => {
    let adminSigner: {
        wallet: HDNodeWallet | ethers.Wallet;
        token: string;
    };
    beforeAll(async () => {
        adminSigner = await authWallet(request, DEPLOYER_PRIVATE_KEY);
        const res = await createRandomDream(request, undefined, {});
        await DreamModel.updateOne(
            { _id: res.dream.id },
            { $set: { status: DreamStatus.REACHED } }
        );
    });

    it("Get withdraw list, OK", async () => {
        const response = await request
            ?.get(ROUTE_GET_BALANCE)
            .set("Authorization", `Bearer ${adminSigner.token}`);
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data.balance).toBe(
            ethers.formatEther(MAX_AMOUNT)
        );
    });
    it("Get withdraw list, Unauthorized", async () => {
        const response = await request?.get(ROUTE_GET_BALANCE);
        expect(response?.status).toBe(401);
    });
});

describe(`POST ${ROUTER_WITHDRAW}`, () => {
    let adminSigner: {
        wallet: HDNodeWallet | ethers.Wallet;
        token: string;
    };
    beforeAll(async () => {
        adminSigner = await authWallet(request, DEPLOYER_PRIVATE_KEY);
        const res = await createRandomDream(request, undefined, {});
        await DreamModel.updateOne(
            { _id: res.dream.id },
            { $set: { status: DreamStatus.REACHED } }
        );
    });

    it("Withdraw all, OK", async () => {
        const response = await request
            ?.post(ROUTER_WITHDRAW)
            .set("Authorization", `Bearer ${adminSigner.token}`)
            .send({
                to: adminSigner.wallet.address,
            });
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body).toEqual({
            ok: true,
            data: {
                status: "success",
                amount: ethers.formatEther(MAX_AMOUNT),
                to: adminSigner.wallet.address,
            },
        });
    });
    it("Withdraw part, OK", async () => {
        const amount = MAX_AMOUNT / BigInt(2);

        const response = await request
            ?.post(ROUTER_WITHDRAW)
            .set("Authorization", `Bearer ${adminSigner.token}`)
            .send({
                to: adminSigner.wallet.address,
                amount: amount.toString(),
            });
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body).toEqual({
            ok: true,
            data: {
                status: "success",
                amount: ethers.formatEther(amount),
                to: adminSigner.wallet.address,
            },
        });
    });
    it("Withdraw, Insufficient balance", async () => {
        const response = await request
            ?.post(ROUTER_WITHDRAW)
            .set("Authorization", `Bearer ${adminSigner.token}`)
            .send({
                to: adminSigner.wallet.address,
                amount: (MAX_AMOUNT * BigInt(2)).toString(),
            });
        expect(response?.status).toBe(403);
        expect(response?.body.ok).toBe(false);
    });

    it("Withdraw, Unauthorized", async () => {
        const response = await request
            ?.post(ROUTER_WITHDRAW)
            .send({ to: adminSigner.wallet.address });
        expect(response?.status).toBe(401);
    });
});
