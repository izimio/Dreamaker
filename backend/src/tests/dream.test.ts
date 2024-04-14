import app from "../app";
import supertest from "supertest";
import { Server } from "http";
import mongoose from "mongoose";
import { HDNodeWallet, ethers } from "ethers";
import {
    authWallet,
    createRandomDream,
    createRandomDreamData,
    randomString,
    randomTags,
} from "./utils/utils";

import { Watcher } from "../Watchers/Watch";
import { SyncronInstance } from "../syncron/Syncron";
let request: supertest.SuperTest<supertest.Test> | undefined;
let server: Server | undefined;

beforeAll(async () => {
    server = app.listen();
    request = supertest(app);
    SyncronInstance.stop();
});

afterAll(async () => {
    server?.close();
    mongoose.connection.close();
    Watcher.stop();
    SyncronInstance.stop();
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

describe(`GET ${ROUTE_GET_DREAMS}`, () => {

    let wSigner: {
        wallet: HDNodeWallet | ethers.Wallet;
        token: string;
    }
    beforeAll(async () => {
        ({ wSigner } = await createRandomDream(request, undefined, {}));
    }, 1000000);

    it("Get dreams, OK", async () => {
        const response = await request?.get(ROUTE_GET_DREAMS);
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data.dreams).toBeDefined();
        const dreams = response?.body.data.dreams;

        let found = 0;
        dreams.forEach((dream: any) => {
            expect(dream.title).toBeDefined();
            expect(dream.description).toBeDefined();
            expect(dream.tags).toBeDefined();
            expect(dream.deadlineTime).toBeDefined();
            expect(dream.targetAmount).toBeDefined();
            expect(dream.minFundingAmount).toBeDefined();
            expect(dream.assets).toBeDefined();

            if (dream.owner === wSigner.wallet.address) {
                found++;
            }
        });
        expect(found).toBe(1);
    });
    it("GET dreams, TAGS", async () => {

        const { dream } = await createRandomDream(request, undefined, {});

        const response = await request?.get(ROUTE_GET_DREAMS + "?_id=" + dream.id);
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);

        const dreams = response?.body.data.dreams;

        expect(dreams.length).toBe(1);
        expect(dreams[0]._id).toBe(dream.id);
    });
});

describe(`GET ${ROUTE_GET_MY_DREAMS}`, () => {

    let wSigner: {
        wallet: HDNodeWallet | ethers.Wallet;
        token: string;
    }

    beforeAll(async () => {
        wSigner = await authWallet(request);
    });

    it("Get my dreams, OK", async () => {
        const response = await request
            ?.get(ROUTE_GET_MY_DREAMS)
            .set("Authorization", `Bearer ${wSigner.token}`);
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data.dreams).toBeDefined();

        const dreams = response?.body.data.dreams;

        expect(dreams.length).toBe(0);

        await createRandomDream(request, wSigner, {});

        const response2 = await request
            ?.get(ROUTE_GET_MY_DREAMS)
            .set("Authorization", `Bearer ${wSigner.token}`);
        expect(response2?.status).toBe(200);
        expect(response2?.body.ok).toBe(true);
        expect(response2?.body.data.dreams).toBeDefined();
        const dreams2 = response2?.body.data.dreams;

        expect(dreams2.length).toBe(1);
        expect(dreams2[0].owner).toBe(wSigner.wallet.address);
    });

});

describe(`PUT ${ROUTE_UPDATE_DREAM}`, () => {
    let gSigner: {
        wallet: HDNodeWallet | ethers.Wallet;
        token: string;
    }
    let gDream: any;
    beforeAll(async () => {
        gSigner = await authWallet(request);
       const res = await createRandomDream(request, gSigner, {});
        gDream = res.dream;
    });
    it("Update dream, OK", async () => {
        const signer = await authWallet(request);
        const { dream } = await createRandomDream(request, signer, {});
        const response = await request
            ?.put(ROUTE_UPDATE_DREAM.replace(":id", dream.id))
            .set("Authorization", `Bearer ${signer.token}`)
            .send({ title: "New title" });
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data.dream).toBeDefined();
        expect(response?.body.data.dream.title).toBe("New title");
    });
    it("Update dream, Unauthorized", async () => {
        const { dream } = await createRandomDream(request, undefined, {});
        const response = await request
            ?.put(ROUTE_UPDATE_DREAM.replace(":id", dream.id))
            .set("Authorization", `Bearer invalid token`)
            .send({ title: "New title" });
        expect(response?.status).toBe(401);
        expect(response?.body.ok).toBe(false);
    });
    it("Update dream, Invalid Id", async () => {
        const signer = await authWallet(request);
        const response = await request
            ?.put(ROUTE_UPDATE_DREAM.replace(":id", "invalid id"))
            .set("Authorization", `Bearer ${signer.token}`)
            .send({ title: "New title" });
        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Update dream, not found", async () => {
        const randomId = "661bbd6c855700b93eb3ea66"
        const signer = await authWallet(request);
        const response = await request
            ?.put(ROUTE_UPDATE_DREAM.replace(":id", randomId))
            .set("Authorization", `Bearer ${signer.token}`)
            .send({ title: "New title" });
        expect(response?.status).toBe(404);
        expect(response?.body.ok).toBe(false);
    });
    it("Update dream, Nothing", async () => {
        const { dream } = await createRandomDream(request, undefined, {});
        const signer = await authWallet(request);
        const response = await request
            ?.put(ROUTE_UPDATE_DREAM.replace(":id", dream.id))
            .set("Authorization", `Bearer ${signer.token}`)
            .send({});
        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Update dream, no-sens Tags", async () => {
        const response = await request
            ?.put(ROUTE_UPDATE_DREAM.replace(":id", gDream.id))
            .set("Authorization", `Bearer ${gSigner.token}`)
            .send({
                tags: [
                    "no-sens"
                ]
            });
        expect(response?.status).toBe(400);
        expect(response?.body.ok).toBe(false);
    });
    it("Update dream, big update, OK", async () => {
        const nTags = randomTags(4);
        const rTitle = randomString(10);
        const rDescription = randomString(50);
        
        const response = await request
            ?.put(ROUTE_UPDATE_DREAM.replace(":id", gDream.id))
            .set("Authorization", `Bearer ${gSigner.token}`)
            .send({
                title: rTitle,
                description: rDescription,
                tags: nTags
            });
        expect(response?.status).toBe(200);
        expect(response?.body.ok).toBe(true);
        expect(response?.body.data.dream).toBeDefined();
        expect(response?.body.data.dream.title).toBe(rTitle);
        expect(response?.body.data.dream.description).toBe(rDescription);
        expect(response?.body.data.dream.tags).toStrictEqual(nTags);
    });
});