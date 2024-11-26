import { Expose } from "class-transformer";

export class EdisubmitterResponse {
    @Expose()
    id: number;

    @Expose()
    actionPending: number;

    @Expose()
    arPackage: string;

    @Expose()
    sender: string;

    @Expose()
    creditRep: number;

    @Expose()
    customer: number;

    @Expose()
    daysLate: number;

    @Expose()
    fileFormat: number;

    @Expose()
    firstContact: Date;

    @Expose()
    firstTransfer: Date;

    @Expose()
    lastTransfer: Date;

    @Expose()
    mailBackRep: number;

    @Expose()
    message: string;

    @Expose()
    misRep: number;

    @Expose()
    note: number;

    @Expose()
    senderMail: string;

    @Expose()
    numberOfAccounts: number;

    @Expose()
    os: string;

    @Expose()
    sendLateNotification: number;

    @Expose()
    status: number;

    @Expose()
    transportMedia: number;

    @Expose()
    version: number;

    @Expose()
    wentProduction: Date;

    @Expose()
    experian: number;

    @Expose()
    datasite: number;

    @Expose()
    sicCode: string;

    @Expose()
    exportsToExperian: number;

    @Expose()
    experianIndustry: number;

    @Expose()
    fileLayout: string;
}
