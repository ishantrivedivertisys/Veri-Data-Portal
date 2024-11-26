import { Expose } from "class-transformer";

export class AccountResponse {
    @Expose()
    id: number;

    @Expose()
    dunsNo: number;

    @Expose()
    name_1: string;

    @Expose()
    name_2: string;

    @Expose()
    address_1: string;

    @Expose()
    address_2: string;

    @Expose()
    city: string;

    @Expose()
    zip_code: string;

    @Expose()
    state: string;

    @Expose()
    country: number;

    @Expose()
    branch: string;

    @Expose()
    parent: number;

    @Expose()
    refer_to: number;

    @Expose()
    principal: string;

    @Expose()
    message: string;

    @Expose()
    sic_code: number;

    @Expose()
    created: number;

    @Expose()
    activity: number;

    @Expose()
    modified: number;

    @Expose()
    internalMsg: string;

    @Expose()
    aliases: string;

    @Expose()
    lat: number;

    @Expose()
    lon: number;

    @Expose()
    fId: string;

    @Expose()
    website: string;

    @Expose()
    parent_name: string;

    @Expose()
    date_business_established: Date;

    @Expose()
    date_of_incorporation: Date;

    @Expose()
    state_of_incorporation: string;
}
