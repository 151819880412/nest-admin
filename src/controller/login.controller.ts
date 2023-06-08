import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginDto } from 'src/pojo/dto/login.dto';
import { LoginServiceImpl } from 'src/service/impl/login.service.impl';

@ApiBearerAuth()
@ApiTags('用户')
@Controller('auth')
export class LoginController {
  constructor(private readonly userService: LoginServiceImpl) {}

  @Public()
  @Post('login')
  login(@Body() user: LoginDto) {
    return this.userService.login(user);
  }
}
