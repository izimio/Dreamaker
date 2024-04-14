import app from "../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { Server } from "http";
import { HDNodeWallet, ethers } from "ethers";
import { authWallet, createRandomDream } from "./utils/utils";
import { Watcher } from "../Watchers/Watch";
import { SyncronInstance } from "../syncron/Syncron";
import { DreamModel, DreamStatus } from "../models/dreamModel";
import { DEPLOYER_PRIVATE_KEY } from "../utils/config";

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

const ROUTE_GETLIST = "/withdraw/list";

describe(`GET ${ROUTE_GETLIST}`, () => {

    let adminSigner: {
        wallet: HDNodeWallet | ethers.Wallet;
        token: string;
    };
    beforeAll(async () => {
        adminSigner = await authWallet(request, DEPLOYER_PRIVATE_KEY);
        const res = await createRandomDream(request, undefined, {});
        await DreamModel.updateOne({ _id: res.dream.id }, { $set: { status: DreamStatus.REACHED } });
    })

    it("Get withdraw list, OK", async () => {
        const response = await request?.get(ROUTE_GETLIST).set("Authorization", `Bearer ${adminSigner.token}`);
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data.dreams).toBeDefined();

        const dreams = response?.body.data.dreams;
        for (const dream of dreams) {
            expect(dream.status).toBe(DreamStatus.REACHED);
        }
        expect(dreams.length).toBeGreaterThanOrEqual(1);
    });
    it("Get withdraw list, Unauthorized", async () => {
        const response = await request?.get(ROUTE_GETLIST);
        expect(response?.status).toBe(401);
    });
});

