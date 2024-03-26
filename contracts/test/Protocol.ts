import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Protocol", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Protocol = await hre.ethers.getContractFactory("Protocol");
    const protocol = await Protocol.deploy();

    return { protocol, owner, otherAccount };
  }

  describe("Default", function () {
    it ("should have the right owner", async function () {
      const { protocol, owner } = await loadFixture(deployFixture);

      expect(await protocol.owner()).to.equal(owner.address);
    });
  });

});
