import { Test, TestingModule } from '@nestjs/testing';
import { TemplateStructureController } from './template-structure.controller';
import { TemplateStructureService } from './template-structure.service';

describe('TemplateStructureController', () => {
  let controller: TemplateStructureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateStructureController],
      providers: [TemplateStructureService],
    }).compile();

    controller = module.get<TemplateStructureController>(TemplateStructureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
