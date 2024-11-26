import { Expose } from "class-transformer";

export class AccountxrefCorResponse {
    @Expose()
    custRefNo: string;

    @Expose()
    account: number;

    @Expose()
    custNo: number;

    @Expose()
    dataSite: number;

    @Expose()
    address1: string;

    @Expose()
    address2: string;

    @Expose()
    city: string;

    @Expose()
    country: number;

    @Expose()
    crc: number;

    @Expose()
    lastTransfer: Date;

    @Expose()
    name1: string;

    @Expose()
    name2: string;

    @Expose()
    state: string;

    @Expose()
    zip: string;
}
