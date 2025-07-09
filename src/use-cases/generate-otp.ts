import IOTP from "../db/interfaces/otp";
import OTPHandler from "../gateways/otp-handler";

export default class GenerateOTP {
    constructor(
        readonly otpHandler: OTPHandler,
        readonly otpDAO: IOTP
    ) {
    }

    async execute(input: Input): Promise<Output> {
        const { expiresInSeconds } = input;
        const otpData = await this.otpHandler.generateOTP(expiresInSeconds);
        if (!otpData || !otpData.otp || !otpData.tokenId || !otpData.secret || !otpData.expiresAt ) throw new Error("Failed to generate OTP data")
        const saveResult = await this.otpDAO.save(otpData.tokenId, otpData.otp, otpData.secret, otpData.expiresAt);
        if (!saveResult) throw new Error("Failed to save OTP data");
        return {
            otp: otpData.otp,
            tokenId: otpData.tokenId,
            expiresAt: otpData.expiresAt
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