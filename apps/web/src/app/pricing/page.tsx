"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try SpikeClip with limited analyses",
    features: [
      "3 heatmap analyses per month",
      "View engagement data",
      "No clip downloads",
      "Standard processing speed",
    ],
    cta: "Get Started",
    href: "/register",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "Full pipeline for solo creators",
    features: [
      "Unlimited heatmap analyses",
      "Download processed clips",
      "Vertical reformatting (9:16)",
      "Priority processing",
      "All export formats",
    ],
    cta: "Start Pro Trial",
    href: "/register",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For agencies and teams",
    features: [
      "Everything in Pro",
      "5 team seats",
      "Priority support",
      "API access",
      "Batch processing",
    ],
    cta: "Contact Sales",
    href: "/register",
    variant: "outline" as const,
  },
];

export default function PricingPage() {
  return (
    <main className="container mx-auto p-4 sm:p-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that fits your workflow. All plans include our core heatmap analysis technology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className={`relative flex flex-col ${
              tier.popular ? "border-primary shadow-md" : ""
            }`}
          >
            {tier.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </div>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ul className="space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.variant}
                className="w-full mt-6"
                asChild
              >
                <Link href={tier.href}>{tier.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
