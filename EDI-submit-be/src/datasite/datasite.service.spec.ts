import { Test, TestingModule } from '@nestjs/testing';
import { DatasiteService } from './datasite.service';

describe('DatasiteService', () => {
  let service: DatasiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatasiteService],
    }).compile();

    service = module.get<DatasiteService>(DatasiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
