import { Test, TestingModule } from '@nestjs/testing';
import { CustomerTemplateService } from './customer-template.service';

describe('CustomerTemplateService', () => {
  let service: CustomerTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerTemplateService],
    }).compile();

    service = module.get<CustomerTemplateService>(CustomerTemplateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
