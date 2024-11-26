import { Test, TestingModule } from '@nestjs/testing';
import { DatasiteController } from './datasite.controller';
import { DatasiteService } from './datasite.service';

describe('DatasiteController', () => {
  let controller: DatasiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DatasiteController],
      providers: [DatasiteService],
    }).compile();

    controller = module.get<DatasiteController>(DatasiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
