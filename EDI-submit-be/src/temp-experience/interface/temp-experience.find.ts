export class IFindAllTempExperience {
    skip?: number;
    limit?: number;
    search?: string;
    sortColumn?: string;
    sortType?: 'ASC' | 'DESC' = 'DESC';
    fromDate?: Date;
    toDate?: Date;
    status?: string;
    memberIds?: string;
  }