import IOTP from "../db/interfaces/otp";
import crypto from "crypto";

export default class GenerateOTP {
    constructor(
        readonly otpDAO: IOTP
    ) {
    }

    async execute(input: Input): Promise<Output> {
        const { expiresInSeconds } = input;
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        const tokenId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + expiresInSeconds * 1000); // Set expiration time        
        const saveResult = await this.otpDAO.save(tokenId, otp, expiresAt);
        if (!saveResult) throw new Error("Failed to save OTP data");
        return {
            otp,
            tokenId,
            expiresAt
        };
    }
}

type Input = {
    expiresInSeconds: number;
}

type Output = {
    otp: string;
    tokenId: string;
    expiresAt: Date;
}