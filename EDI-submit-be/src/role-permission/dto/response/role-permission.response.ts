import { Expose } from 'class-transformer';
import { TransformDateToEpoch } from 'src/common/helpers/decorators/transformDateToEpoch';

export class RolePermissionResponse { 
    @Expose()
    id: number;
    
    @Expose()
    roleId: number;
  
    @Expose()
    permissionId: number;

    @Expose()
    status: string;

    @TransformDateToEpoch()
    @Expose()
    createdDate?: number;

    @TransformDateToEpoch()
    @Expose()
    updatedDate?: number;
}