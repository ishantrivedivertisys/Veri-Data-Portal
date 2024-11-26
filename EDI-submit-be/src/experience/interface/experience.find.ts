export class IFindAllExperience {
    skip?: number;
    limit?: number;
    search?: string;
    sortColumn?: string;
    sortType?: 'ASC' | 'DESC' = 'DESC';
  }