import { Expose } from "class-transformer";

export class ZipCodeResponse {
    @Expose()
    id: number;

    @Expose()
    zip_code: string;

    @Expose()
    zip_code_type: string;

    @Expose()
    city: string;

    @Expose()
    state: string;

    @Expose()
    lat: number;

    @Expose()
    lon: number;

    @Expose()
    country: string;
}