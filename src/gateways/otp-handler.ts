import { authenticator } from 'otplib';
import crypto from 'crypto';

export default class OTPHandler {

    async generateOTP(expiresInSeconds: number): Promise<OTPData | null> {
        try {
            const secret = authenticator.generateSecret();
            const epoch = Date.now();
            const otp = authenticator.generate(secret);
            const expiresAt = epoch + expiresInSeconds * 1000;
            const tokenId = crypto.randomUUID();
            return {
                otp,
                tokenId,
                secret,
                expiresAt: new Date(expiresAt)
            }
        } catch (error) {
            console.error("Error generating OTP:", error);
            return null;
        }
    }

    async validateOTP(otp: string, secret: string): Promise<boolean> {
        const isValid = authenticator.check(otp, secret);
        if (!isValid) {
            console.error("Invalid OTP:", otp);
            return false;
        }
        return true;
    }
}

type OTPData = {
    otp: string;
    tokenId: string;
    secret: string;
    expiresAt: Date;
};