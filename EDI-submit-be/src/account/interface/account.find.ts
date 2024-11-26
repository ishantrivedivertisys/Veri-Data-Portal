export class IFindAllAccount {
    skip?: number;
    limit?: number;
    search?: string;
    sortColumn?: string;
    sortType?: 'ASC' | 'DESC' = 'DESC';
    address_1?: string;
    city?: string;
    state?: string;
    country?: string;
    zip_code?: string;
  }