import { Test, TestingModule } from '@nestjs/testing';
import { CustomerCoreController } from './customer_core.controller';
import { CustomerCoreService } from './customer_core.service';

describe('CustomerCoreController', () => {
  let controller: CustomerCoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerCoreController],
      providers: [CustomerCoreService],
    }).compile();

    controller = module.get<CustomerCoreController>(CustomerCoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
