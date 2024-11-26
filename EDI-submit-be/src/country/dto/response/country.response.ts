import { Expose } from "class-transformer";

export class CountryReponse {
    @Expose()
    code: string;

    @Expose()
    name: string;

    @Expose()
    region: number;

    @Expose()
    twoCharCode: string;
}
