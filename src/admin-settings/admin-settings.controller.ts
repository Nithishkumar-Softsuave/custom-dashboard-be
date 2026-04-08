import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { ConnectingService } from './connecting.service';
import { DbCredentialsDto } from './admin-settings.dto';
// import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('settings')
export class AdminSettingsController {
  constructor(
    private readonly dbService: AdminSettingsService,
    private readonly replicationService: ConnectingService,
  ) {}

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('test-save-connection')
  async testConnection(@Req() req: Request, @Body() body: DbCredentialsDto) {
    return await this.dbService.checkWithCredentials(body, req);
  }

  // @Post('save-connection')
  // async saveConnection(
  //   @Body()
  //   body: DbCredentialsDto,
  // ) {
  //   return await this.dbService.saveConnection(body);
  // }

  // @Post('replicate-tables')
  // async replicateTables(
  //   @Body()
  //   body: {
  //     source: {
  //       host: string;
  //       port: number;
  //       user: string;
  //       password: string;
  //       database: string;
  //       dbType: DBType;
  //     };
  //     destination: {
  //       host: string;
  //       port: number;
  //       user: string;
  //       password: string;
  //       database: string;
  //       dbType: DBType;
  //     };
  //     tables: string[];
  //   },
  // ) {
  //   return await this.replicationService.replicateTables(
  //     body.source,
  //     body.destination,
  //     body.tables,
  //   );
  // }
}
