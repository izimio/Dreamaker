import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("Dreamaker", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const Dreamaker = await hre.ethers.getContractFactory("Dreamaker");
    const dreamaker = await Dreamaker.deploy();

    return { dreamaker, owner, otherAccount };
  }

  describe("Default", function () {
    it ("should have the right owner", async function () {
      const { dreamaker, owner } = await loadFixture(deployFixture);

      expect(await dreamaker.owner()).to.equal(owner.address);
    });
  });

});
