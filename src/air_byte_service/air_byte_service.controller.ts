import { Body, Controller, Post } from '@nestjs/common';
import { AirByteServiceService } from './air_byte_service.service';
import { DBCredentialsDto } from './air_byte_service.dto';

@Controller('air-byte-service')
export class AirByteServiceController {
  constructor(private readonly airByteServiceService: AirByteServiceService) {}

  @Post('connect-source')
  connectSourceDb(@Body() body: DBCredentialsDto) {
    return this.airByteServiceService.connectSourceDb(body);
  }
}
