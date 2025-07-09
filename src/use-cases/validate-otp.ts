import IOTP from "../db/interfaces/otp";
import OTPHandler from "../gateways/otp-handler";

export default class ValidateOTP {
    constructor(
        readonly otpHandler: OTPHandler,
        readonly otpDAO: IOTP,
    ) {
    }

    async execute(input: Input): Promise<Output> {
        const { otp, tokenId } = input;      
        const otpData = await this.otpDAO.getById(tokenId);
        if (!otpData) throw new Error("OTP not found or has expired");        

        if (otpData.expiresAt < new Date()) {
            await this.otpDAO.deleteById(tokenId);
            return {
                message: "OTP has expired",
                valid: false
            };
        }

        const isValid = await this.otpHandler.validateOTP(otp, otpData.secret);
        if (!isValid) {
            return {
                message: "Invalid OTP",
                valid: false
            }
        }
        const deleteResult = await this.otpDAO.deleteById(tokenId);
        if (!deleteResult) throw new Error("Failed to delete OTP after validation");
        return {
            message: "OTP validated successfully",
            valid: true
        };
    }
}

type Input = {
    otp: string;
    tokenId: string;
}

type Output = {
    message: string;
    valid: boolean;
}