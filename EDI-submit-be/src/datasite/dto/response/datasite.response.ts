import { Expose } from "class-transformer";

export class DatasiteResponse {
    @Expose()
    id: number;

    @Expose()
    customer: number;

    @Expose()
    message: string;
}