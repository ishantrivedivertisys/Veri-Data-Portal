import { Test, TestingModule } from '@nestjs/testing';
import { TemplateStructureService } from './template-structure.service';

describe('TemplateStructureService', () => {
  let service: TemplateStructureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateStructureService],
    }).compile();

    service = module.get<TemplateStructureService>(TemplateStructureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
