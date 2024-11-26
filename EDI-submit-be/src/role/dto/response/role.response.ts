import { Expose } from 'class-transformer';
import { TransformDateToEpoch } from 'src/common/helpers/decorators/transformDateToEpoch';

export class RoleResponse { 
    @Expose()
    name: string;
    
    @Expose()
    status: string;

    @TransformDateToEpoch()
    @Expose()
    createdAt?: number;

    @TransformDateToEpoch()
    @Expose()
    updatedAt?: number;
}
