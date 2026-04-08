import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto, SigninDto } from './auth.dto';
import {
  ICommonResponse,
  ILoginResponse,
  IRefreshResponse,
} from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Post('signin')
  async signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  //   @Post('refresh')
  //   async refresh(
  //     @Body() body: RefreshTokenDto,
  //   ): Promise<ICommonResponse<IRefreshResponse>> {
  //     return this.authService.refreshToken(body.refreshToken);
  //   }
}
