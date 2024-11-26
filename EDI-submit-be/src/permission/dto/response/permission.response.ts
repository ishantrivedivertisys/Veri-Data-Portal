import { Expose } from 'class-transformer';
import { TransformDateToEpoch } from 'src/common/helpers/decorators/transformDateToEpoch';

export class PermissionResponse { 
    @Expose()
    id: number;
    
    @Expose()
    name: string;
  
    @Expose()
    status: string;

    @Expose()
    permissionGroupName: string;

    @Expose()
    permissionSubGroupName: string;

    @Expose()
    permissionKey: string;

    @TransformDateToEpoch()
    @Expose()
    createdDate?: number;

    @TransformDateToEpoch()
    @Expose()
    updatedDate?: number;
}