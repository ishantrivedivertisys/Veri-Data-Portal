import { Test, TestingModule } from '@nestjs/testing';
import { AccountxrefCoreController } from './accountxref_core.controller';
import { AccountxrefCoreService } from './accountxref_core.service';

describe('AccountxrefCoreController', () => {
  let controller: AccountxrefCoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountxrefCoreController],
      providers: [AccountxrefCoreService],
    }).compile();

    controller = module.get<AccountxrefCoreController>(AccountxrefCoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
