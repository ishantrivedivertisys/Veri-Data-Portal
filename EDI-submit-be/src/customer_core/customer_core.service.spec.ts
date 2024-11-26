import { Test, TestingModule } from '@nestjs/testing';
import { CustomerCoreService } from './customer_core.service';

describe('CustomerCoreService', () => {
  let service: CustomerCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerCoreService],
    }).compile();

    service = module.get<CustomerCoreService>(CustomerCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
