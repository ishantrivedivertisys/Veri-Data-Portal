import { Expose } from "class-transformer";

export class CustomerCoreResponse {
    @Expose()
    name1: string;

    @Expose()
    name2: string;

    @Expose()
    message: string;

    @Expose()
    created: number;

    @Expose()
    createUser: string;

    @Expose()
    modified: number;

    @Expose()
    modUser: string;

    @Expose()
    note: number;

    @Expose()
    aliases: string;

    @Expose()
    industry: number;

    @Expose()
    creditAppCode: string;

    @Expose()
    creditAppEnabled: number;

    @Expose()
    creditAppStart: number;

    @Expose()
    creditAppTierCount: number;

    @Expose()
    autoEmailCreditRefs: number;

    @Expose()
    rcTrackerEnabled: number;
}
