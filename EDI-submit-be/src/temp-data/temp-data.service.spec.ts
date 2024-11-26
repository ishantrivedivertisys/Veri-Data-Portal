import { Test, TestingModule } from '@nestjs/testing';
import { TempDataService } from './temp-data.service';

describe('TempDataService', () => {
  let service: TempDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TempDataService],
    }).compile();

    service = module.get<TempDataService>(TempDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
