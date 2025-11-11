import { Module } from '@nestjs/common';
import { AirByteServiceService } from './air_byte_service.service';
import { AirByteServiceController } from './air_byte_service.controller';

@Module({
  controllers: [AirByteServiceController],
  providers: [AirByteServiceService],
})
export class AirByteServiceModule {}
