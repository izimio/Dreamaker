import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = (process.env.JWT_SECRET as string) || "";
if (!JWT_SECRET) {
    console.error("JWT secret is required in env");
    process.exit(1);
}
const address = process.argv[2];
if (!address || address.length !== 42) {
    console.error("Address is required");
    process.exit(1);
}

const main = async () => {
    const token = jwt.sign({ address: address }, JWT_SECRET, {
        expiresIn: "100d",
    });
    console.log({
        token,
    });
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
