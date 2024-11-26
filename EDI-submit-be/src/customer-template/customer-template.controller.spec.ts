import { Test, TestingModule } from '@nestjs/testing';
import { CustomerTemplateController } from './customer-template.controller';
import { CustomerTemplateService } from './customer-template.service';

describe('CustomerTemplateController', () => {
  let controller: CustomerTemplateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerTemplateController],
      providers: [CustomerTemplateService],
    }).compile();

    controller = module.get<CustomerTemplateController>(CustomerTemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
