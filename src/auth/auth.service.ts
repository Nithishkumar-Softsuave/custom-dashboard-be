import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  ILoginResponse,
  IRefreshResponse,
  ICommonResponse,
} from './auth.interface';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/database/models/user.model';
import { ConfigService } from '@nestjs/config';
import { SigninDto } from './auth.dto';
import { RoleModel } from 'src/database/models/role.model';
import { OrgModel } from 'src/database/models/org.model';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(UserModel)
    private readonly userModel: typeof UserModel,
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
    @InjectModel(OrgModel)
    private readonly orgModel: typeof OrgModel,
  ) {
    this.saltRounds = Number(
      this.configService.get('BCRYPT_SALT_ROUNDS') ?? 10,
    );
  }

  async login(email: string, Password: string) {
    try {
      const user = await this.userModel.findOne({
        where: { email },
      });

      if (!user) {
        return {
          error: {
            type: 'login in failed',
            message: 'Invalid credentials',
            code: 400,
          },
        };
      }

      const isMatch = await bcrypt.compare(Password, user.password);
      if (!isMatch)
        return {
          error: {
            type: 'login in failed',
            message: 'Invalid credentials',
            code: 400,
          },
        };

      if (!user.isActive) {
        return {
          error: {
            type: 'login in failed',
            message: 'User is not active',
            code: 400,
          },
        };
      }

      const role = await this.roleModel.findOne({
        where: { roleId: user.roleId },
      });

      const { password, ...tokenData } = user;

      tokenData['role'] = role?.roleName;

      const accessToken = await this.jwtService.signAsync(tokenData);
      const refreshToken = await this.jwtService.signAsync(tokenData, {
        expiresIn: '7d',
      });

      this.logger.log('Login successful for the user:' + user.userId);
      return {
        success: true,
        message: 'Login successful',
        data: {
          token: { accessToken: accessToken, refreshToken: refreshToken },
          userDetails: {
            userName: user.username,
            email: user.email,
            role: user.roleId,
          },
        },
      };
    } catch (error: any) {
      return { success: false, message: error?.message || 'Login failed' };
    }
  }

  async signin(payload: SigninDto) {
    const { username, password, email, organization } = payload;
    try {
      const existingUser = await this.userModel.findOne({ where: { email } });

      if (existingUser) {
        return {
          error: {
            type: 'sign in failed',
            message: 'User with this email already exists',
            code: 400,
          },
        };
      }

      const existingOrg = await this.orgModel.findOne({
        where: { orgName: organization },
      });

      if (existingOrg) {
        return {
          error: {
            type: 'sign in failed',
            message: 'Organization with this name already exists',
            code: 400,
          },
        };
      }

      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      const newUser = await this.userModel.create({
        username,
        email,
        password: hashedPassword,
      });

      const newOrg = await this.orgModel.create({
        orgName: organization,
        adminUserId: newUser?.dataValues?.userId,
      });

      this.logger.log('Signin successful for user:' + newUser.email);

      return {
        message: 'Signin successful',
        data: {},
        code: 201,
      };
    } catch (error) {
      this.logger.error('Signin catch error :' + error.message);
      throw new HttpException(error.message || 'Signin failed', 400);
    }
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      this.logger.error('authorization catch error :' + error.message);
      throw new UnauthorizedException(error.message || 'Authorization failed');
    }
  }

  //   async refreshToken(
  //     refreshToken: string,
  //   ): Promise<ICommonResponse<IRefreshResponse>> {
  //     try {
  //       const payload = this.jwtService.verify<IJwtPayload>(refreshToken, {
  //         secret: process.env.JWT_REFRESH_SECRET || 'refreshsecretkey',
  //       });

  //       const storedToken = this.refreshTokens.get(payload.sub);
  //       if (storedToken !== refreshToken) {
  //         throw new UnauthorizedException('Invalid refresh token');
  //       }

  //       const newAccessToken = this.jwtService.sign({
  //         sub: payload.sub,
  //         username: payload.username,
  //       });

  //       return {
  //         success: true,
  //         message: 'Access token refreshed successfully',
  //         data: { accessToken: newAccessToken },
  //       };
  //     } catch (error) {
  //       return {
  //         success: false,
  //         message: error.message || 'Invalid or expired refresh token',
  //       };
  //     }
  //   }

  //   async verifyToken(token: string): Promise<IJwtPayload> {
  //     try {
  //       return this.jwtService.verify<IJwtPayload>(token);
  //     } catch {
  //       throw new UnauthorizedException('Invalid or expired token');
  //     }
  //   }
}
