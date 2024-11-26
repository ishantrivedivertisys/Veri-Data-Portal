import { Expose } from "class-transformer";

export class CurrencyRateReponse {
    @Expose()
    wefDate: Date;

    @Expose()
    currency: string;

    @Expose()
    dollar: number;

    @Expose()
    status: string;
}
