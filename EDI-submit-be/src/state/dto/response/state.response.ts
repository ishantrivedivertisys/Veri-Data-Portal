import { Expose } from "class-transformer";

export class StateResponse {
    @Expose()
    country: number;

    @Expose()
    code: string;

    @Expose()
    name: string;
}