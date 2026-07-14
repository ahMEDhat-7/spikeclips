import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Request,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { UserResponseDto } from "./dto/user-response.dto";
import { Public } from "./jwt-auth.guard";

const COOKIE_NAME = "access_token";
const COOKIE_MAX_AGE = 15 * 60 * 1000; // 15 minutes

function setAuthCookie(res: Response, token: string): void {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new account", description: "Creates a new user account and returns user data. JWT is set as httpOnly cookie." })
  @ApiResponse({ status: 201, description: "Account created successfully", type: AuthResponseDto })
  @ApiResponse({ status: 409, description: "Email already registered" })
  @ApiResponse({ status: 400, description: "Invalid input" })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponseDto> {
    const result = await this.authService.register(dto.email, dto.password, dto.name);
    setAuthCookie(res, result.accessToken);
    return {
      userId: result.userId,
      email: result.email,
      name: result.name,
      plan: result.plan,
      analysesUsed: result.analysesUsed,
      analysesLimit: result.analysesLimit,
      scenesLimit: result.scenesLimit,
    };
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login", description: "Authenticates user and returns user data. JWT is set as httpOnly cookie." })
  @ApiResponse({ status: 200, description: "Login successful", type: AuthResponseDto })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<AuthResponseDto> {
    const result = await this.authService.login(dto.email, dto.password);
    setAuthCookie(res, result.accessToken);
    return {
      userId: result.userId,
      email: result.email,
      name: result.name,
      plan: result.plan,
      analysesUsed: result.analysesUsed,
      analysesLimit: result.analysesLimit,
      scenesLimit: result.scenesLimit,
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout", description: "Clears the authentication cookie." })
  @ApiResponse({ status: 200, description: "Logged out successfully" })
  async logout(@Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    clearAuthCookie(res);
    return { message: "Logged out successfully" };
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user", description: "Returns the authenticated user's profile." })
  @ApiResponse({ status: 200, description: "User profile", type: UserResponseDto })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async getProfile(@Request() req: { user: { userId: string } }): Promise<UserResponseDto | null> {
    return this.authService.getProfile(req.user.userId);
  }

  @Patch("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update profile", description: "Update the authenticated user's name or email." })
  @ApiResponse({ status: 200, description: "Updated user profile", type: UserResponseDto })
  @ApiResponse({ status: 409, description: "Email already in use" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async updateProfile(
    @Request() req: { user: { userId: string } },
    @Body() dto: UpdateProfileDto
  ): Promise<UserResponseDto> {
    return this.authService.updateProfile(req.user.userId, dto);
  }

  @Post("change-password")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Change password", description: "Change the authenticated user's password." })
  @ApiResponse({ status: 200, description: "Password changed successfully" })
  @ApiResponse({ status: 401, description: "Current password is incorrect" })
  async changePassword(
    @Request() req: { user: { userId: string } },
    @Body() dto: ChangePasswordDto
  ): Promise<{ message: string }> {
    await this.authService.changePassword(req.user.userId, dto.currentPassword, dto.newPassword);
    return { message: "Password changed successfully" };
  }
}
