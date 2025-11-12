import { Test, TestingModule } from '@nestjs/testing';
import { DynamicDbInstanceService } from './dynamic_db_instance.service';

describe('DynamicDbInstanceService', () => {
  let service: DynamicDbInstanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicDbInstanceService],
    }).compile();

    service = module.get<DynamicDbInstanceService>(DynamicDbInstanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
