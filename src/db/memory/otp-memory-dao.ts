import IOTP from "../interfaces/otp";

export default class OTPMemory implements IOTP {
    private otpStore: Map<string, { otp: string; secret: string, expiresAt: Date }> = new Map();

    async save(id: string, otp: string, secret: string, expiresAt: Date): Promise<boolean> {
        this.otpStore.set(id, { otp, secret, expiresAt });
        return true;
    }

    async getById(id: string): Promise<{ id: string, otp: string; secret: string; expiresAt: Date } | null> {
        const otpData = this.otpStore.get(id);
        if (otpData) {
            return { id, ...otpData };
        }
        return null;
    }

    async deleteById(id: string): Promise<boolean> {
        this.otpStore.delete(id);
        return true;
    }
}