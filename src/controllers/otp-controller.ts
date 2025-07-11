import { Request, Response } from "express";
import GenerateOTP from "../use-cases/generate-otp";
import ValidateOTP from "../use-cases/validate-otp";

export default class OTPController {
    constructor(
        readonly generate_otp_use_case: GenerateOTP,
        readonly validate_otp_use_case: ValidateOTP
    ) {
    }

    async generateOTP(req: Request, res: Response) {
        try {
            const { expiresInSeconds } = req.body;
            if (typeof expiresInSeconds !== 'number' || expiresInSeconds <= 0) {
                return res.status(400).send({ error: 'Invalid expiresInSeconds value' });
            }
            const result = await this.generate_otp_use_case.execute({ expiresInSeconds });
            return res.status(200).send({
                message: 'OTP generated successfully', data: {
                    otp: result.otp,
                    tokenId: result.tokenId,
                    expiresAt: result.expiresAt.toISOString()
                }
            });
        } catch (error) {
            console.error('Error generating OTP:', error);
            return res.status(500).send({ error: 'Internal server error' });
        }
    }

    async verifyOTP(req: Request, res: Response) {
        try {
            const { tokenId, otp } = req.body;
            if (typeof tokenId !== 'string' || typeof otp !== 'string' || !tokenId || !otp) {
                return res.status(400).send({ error: 'Invalid tokenId or otp' });
            }

            const result = await this.validate_otp_use_case.execute({ tokenId, otp });
            if (!result.isValid) {               
                return res.status(400).send({ message: result.message, isValid: result.isValid });
            }
            return res.status(200).send({
                message: result.message, isValid: result.isValid
            });
        } catch (error) {
            console.error('Error verifying OTP:', error);
            return res.status(500).send({ error: 'Internal server error' });
        }
    }
}