import { Expose } from 'class-transformer';
import { TransformDateToEpoch } from 'src/common/helpers/decorators/transformDateToEpoch';

export class TemplateStructureResponse { 
    @Expose()
    id: number;
  
    @Expose()
    templateColumnName: string;

    @Expose()
    tableColumnName: string;

    @Expose()
    validation: string;

    @Expose()
    isMultipleAllow: number;

    @TransformDateToEpoch()
    @Expose()
    createdAt?: number;

    @TransformDateToEpoch()
    @Expose()
    updatedAt?: number;
}
