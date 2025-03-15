import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  UseGuards,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/auth.decorator';
import { UserProfile } from '../types/user.types';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @CurrentUser() userId: any,
    @Body() createProfileDto: CreateProfileDto
  ): Promise<UserProfile> {
    console.log(userId.id, "userId2");
    return this.usersService.createProfile(userId.id, createProfileDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(
    @CurrentUser() userId: any
  ): Promise<UserProfile> {
    console.log(userId.id, "userId2");
    return this.usersService.getProfile(userId.id);
  }

  @UseGuards(AuthGuard)
  @Put('profile')
  async updateProfile(
    @CurrentUser() userId: any,
    @Body() updateData: Partial<CreateProfileDto>
  ): Promise<UserProfile> {
    return this.usersService.updateProfile(userId.id, updateData);
  }

  @UseGuards(AuthGuard)
  @Delete('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(
    @CurrentUser() userId: any
  ): Promise<void> {
    return this.usersService.deleteProfile(userId.id);
  }

  // Admin only endpoint - get any user's profile by ID
  @Get('profile/:userId')
  @UseGuards(AuthGuard)
  async getProfileById(
    @CurrentUser() currentUserId: string,
    @Body('userId') targetUserId: string
  ): Promise<UserProfile> {
    // TODO: Add admin role check here
    return this.usersService.getProfile(targetUserId);
  }
} 