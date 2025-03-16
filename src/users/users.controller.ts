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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users') // Groups under "Users" in Swagger UI
@ApiBearerAuth() // Requires JWT auth in Swagger UI
@Controller('users')
@UseGuards(AuthGuard) // Apply authentication guard globally to this controller
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a user profile' })
  @ApiResponse({ status: 201, description: 'Profile created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post('profile')
  @HttpCode(HttpStatus.CREATED)
  async createProfile(
    @CurrentUser() userId: any,
    @Body() createProfileDto: CreateProfileDto
  ): Promise<UserProfile> {
    console.log(userId.id, "userId2");
    return this.usersService.createProfile(userId.id, createProfileDto);
  }

  @ApiOperation({ summary: 'Get the authenticated user’s profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('profile')
  async getProfile(@CurrentUser() userId: any): Promise<UserProfile> {
    console.log(userId.id, "userId2");
    return this.usersService.getProfile(userId.id);
  }

  @ApiOperation({ summary: 'Update the authenticated user’s profile' })
  @ApiResponse({ status: 200, description: 'Profile updated', })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Put('profile')
  async updateProfile(
    @CurrentUser() userId: any,
    @Body() updateData: Partial<CreateProfileDto>
  ): Promise<UserProfile> {
    return this.usersService.updateProfile(userId.id, updateData);
  }

  @ApiOperation({ summary: 'Delete the authenticated user’s profile' })
  @ApiResponse({ status: 204, description: 'Profile deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Delete('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(@CurrentUser() userId: any): Promise<void> {
    return this.usersService.deleteProfile(userId.id);
  }

  @ApiOperation({ summary: 'Get a user’s profile by ID (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Profile retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @Get('profile/:userId')
  async getProfileById(
    @CurrentUser() currentUserId: string,
    @Body('userId') targetUserId: string
  ): Promise<UserProfile> {
    // TODO: Add admin role check here
    return this.usersService.getProfile(targetUserId);
  }
}
