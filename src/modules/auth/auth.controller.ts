import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CONTROLLER_CONSTANTS } from '../../common/constants/api.constant';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';

@Controller(CONTROLLER_CONSTANTS.AUTH)
@ApiTags(CONTROLLER_CONSTANTS.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/login')
  @ApiOperation({
    summary: 'Send signature to create access token',
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDTO: LoginDTO): Promise<{ token: string }> {
    const token = await this.authService.userLogIn(loginDTO);
    return { token };
  }
}
