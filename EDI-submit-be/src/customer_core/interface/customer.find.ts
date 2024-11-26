export class IFindAllCustomer {
    skip?: number;
    limit?: number;
    search?: string;
    sortColumn?: string;
    sortType?: 'ASC' | 'DESC' = 'DESC';
  }