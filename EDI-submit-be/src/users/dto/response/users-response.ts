import { Expose } from 'class-transformer';
import { TransformDateToEpoch } from 'src/common/helpers/decorators/transformDateToEpoch';
import { UsersStatus } from 'src/common/model/usersStatus';

export class UserResponse {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  @TransformDateToEpoch()
  dob: Date;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  address: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  zip: string;

  @Expose()
  password: string;

  @Expose()
  status: string;

  @Expose()
  date: Date;
}
