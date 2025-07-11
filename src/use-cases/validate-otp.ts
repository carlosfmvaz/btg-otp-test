import IOTP from "../db/interfaces/otp";

export default class ValidateOTP {
    constructor(
        readonly otpDAO: IOTP
    ) {
    }

    async execute(input: Input): Promise<Output> {
        const { otp, tokenId } = input;      
        const otpData = await this.otpDAO.getById(tokenId);
        if (!otpData) {
            return {
                message: "Invalid tokenId",
                isValid: false
            };
        }    
        if (otpData.otp !== otp) {
            return {
                message: "Invalid OTP",
                isValid: false
            };
        }

        if (otpData.expiresAt < new Date()) {
            await this.otpDAO.deleteById(tokenId);
            return {
                message: "OTP has expired",
                isValid: false
            };
        }

        const deleteResult = await this.otpDAO.deleteById(tokenId);
        if (!deleteResult) throw new Error("Failed to delete OTP after validation");
        return {
            message: "OTP validated successfully",
            isValid: true
        };
    }
}

type Input = {
    otp: string;
    tokenId: string;
}

type Output = {
    message: string;
    isValid: boolean;
}
