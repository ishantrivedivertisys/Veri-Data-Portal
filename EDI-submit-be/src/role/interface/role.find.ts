export class IFindAllRoles {
    skip?: number;
    limit?: number;
    search?: string;
    sortColumn?: string;
    sortType?: 'ASC' | 'DESC' = 'DESC';
    status: string;
  }