import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
  RawBodyRequest,
  UnauthorizedException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Request, Response } from "express";
import Stripe from "stripe";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PaymentsService } from "./payments.service";
import { CreateCheckoutSessionDto, CreatePortalSessionDto } from "./dto/checkout-session.dto";
import { Public } from "../../infrastructure/auth/jwt-auth.guard";
import { SkipThrottle } from "@nestjs/throttler";

@ApiTags("Payments")
@Controller("payments")
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("checkout")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a Stripe checkout session for a subscription plan" })
  @ApiResponse({ status: 200, description: "Checkout session URL returned" })
  @ApiResponse({ status: 401, description: "Authentication required" })
  async createCheckoutSession(
    @Req() req: Request & { user?: { sub?: string; email?: string } },
    @Body() dto: CreateCheckoutSessionDto
  ) {
    if (!req.user?.sub || !req.user?.email) {
      throw new UnauthorizedException("Authentication required");
    }
    return this.paymentsService.createCheckoutSession(
      req.user.sub,
      req.user.email,
      dto.plan,
      dto.interval,
      dto.successUrl,
      dto.cancelUrl
    );
  }

  @Post("portal")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a Stripe customer portal session" })
  @ApiResponse({ status: 200, description: "Portal session URL returned" })
  @ApiResponse({ status: 401, description: "Authentication required" })
  async createPortalSession(
    @Req() req: Request & { user?: { sub?: string } },
    @Body() dto: CreatePortalSessionDto
  ) {
    if (!req.user?.sub) {
      throw new UnauthorizedException("Authentication required");
    }
    return this.paymentsService.createPortalSession(req.user.sub, dto.returnUrl);
  }

  @Post("webhook")
  @Public()
  @SkipThrottle()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Handle Stripe webhook events" })
  @ApiResponse({ status: 200, description: "Webhook acknowledged" })
  @ApiResponse({ status: 400, description: "Invalid signature" })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response
  ) {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      this.logger.warn("STRIPE_WEBHOOK_SECRET not set — rejecting webhook");
      throw new ServiceUnavailableException("Webhook secret not configured");
    }

    let event: Stripe.Event;
    try {
      event = this.paymentsService.verifyWebhookSignature(req.rawBody!, sig, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err}`);
      return res.status(400).json({ error: "Invalid signature" });
    }

    try {
      await this.paymentsService.handleWebhook(event);
    } catch (err) {
      this.logger.error(`Webhook handler failed: ${err}`);
      return res.status(500).json({ error: "Webhook handler failed" });
    }
    return res.status(200).json({ received: true });
  }
}
