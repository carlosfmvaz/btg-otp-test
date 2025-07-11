export default interface IOTP {
    save(id: string, otp: string, expiresAt: Date): Promise<boolean>;
    getById(id: string): Promise<{ id: string; otp: string; expiresAt: Date } | null>;
    deleteById(id: string): Promise<boolean>;
}