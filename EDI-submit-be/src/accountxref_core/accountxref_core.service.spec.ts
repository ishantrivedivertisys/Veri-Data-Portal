import { Test, TestingModule } from '@nestjs/testing';
import { AccountxrefCoreService } from './accountxref_core.service';

describe('AccountxrefCoreService', () => {
  let service: AccountxrefCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AccountxrefCoreService],
    }).compile();

    service = module.get<AccountxrefCoreService>(AccountxrefCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
