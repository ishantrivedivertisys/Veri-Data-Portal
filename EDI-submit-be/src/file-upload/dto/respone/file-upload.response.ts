import { Expose } from 'class-transformer';
import { TransformDateToEpoch } from 'src/common/helpers/decorators/transformDateToEpoch';

export class FileUploadResponse { 
    @Expose()
    fileName: string;
  
    @Expose()
    filePath: string;
  
    @Expose()
    fileSize: string;

    @Expose()
    noOfRows: number;
  
    @Expose()
    status: string;

    @Expose()
    statusReason: string;

    @Expose()
    customerNo: number;

    @Expose()
    datasite: number;

    @Expose()
    customerTemplateId: number;

    @Expose()
    unmatchedColumns: string;

    @TransformDateToEpoch()
    @Expose()
    createdAt?: number;

    @TransformDateToEpoch()
    @Expose()
    updatedAt?: number;
}
