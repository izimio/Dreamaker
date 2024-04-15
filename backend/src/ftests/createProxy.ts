import axios from "axios";
import { ethers } from "ethers";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const API_URL = "http://localhost:8080";

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
    console.error("JWT secret is required");
    process.exit(1);
}

const getToken = async (Wallet: ethers.Wallet) => {
    const token = jwt.sign({ address: Wallet.address }, JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
};

const main = async () => {
    const PK = process.env.DEPLOYER_PRIVATE_KEY as string;
    if (!PK) {
        console.error("Private key is required");
        return;
    }
    const Signer = new ethers.Wallet(PK);

    let token: string;
    try {
        token = await getToken(Signer);
    } catch (e) {
        console.error("Failed to get token", e);
        return;
    }

    const MINUTE_NUMBERS = Number(process.argv[2]) || 2;

    const time = Math.ceil(Date.now() / 1000 + MINUTE_NUMBERS * 60);

    const formData = new FormData();
    formData.append("targetAmount", ethers.parseEther("1").toString());
    formData.append("deadlineTime", time.toString());
    formData.append(
        "description",
        "12345678901234567890123456789012345678901234567890123456789"
    );
    formData.append("title", "Test-" + MINUTE_NUMBERS);
    formData.append("tags", "Politics,Sports");

    try {
        await axios.post(API_URL + "/dream", formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    } catch (e) {
        console.error("Failed to create dream", e);
        return;
    }

    console.log({
        owner: Signer.address,
        endsIn: time - Date.now() / 1000,
    });
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
