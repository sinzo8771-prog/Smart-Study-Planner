import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const pricingPlans = {
  pro: {
    name: 'Pro Plan',
    price: 9.99,
    features: ['Unlimited subjects', 'AI quiz generation', 'Advanced analytics', 'Priority support'],
  },
  premium: {
    name: 'Premium Plan',
    price: 19.99,
    features: ['Everything in Pro', 'AI study assistant', 'Custom themes', 'API access', 'Team collaboration'],
  },
};

// Lazy initialize Stripe to avoid build-time errors
let stripeInstance: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured in environment variables');
    }
    stripeInstance = new Stripe(secretKey);
  }
  return stripeInstance;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured');
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { planId, userId, userEmail } = body;

    console.log('Checkout request received:', { planId, userId, userEmail });

    if (!planId || !pricingPlans[planId as keyof typeof pricingPlans]) {
      console.error('Invalid plan selected:', planId);
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const plan = pricingPlans[planId as keyof typeof pricingPlans];
    console.log('Creating checkout session for plan:', plan.name);

    const stripe = getStripe();

    // Create a Stripe checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.features.join(', '),
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?payment=cancelled`,
      metadata: {
        userId: userId || 'guest',
        planId: planId,
      },
    };

    // Only add customer_email if provided
    if (userEmail) {
      sessionParams.customer_email = userEmail;
    }

    console.log('Calling Stripe API...');
    const session = await stripe.checkout.sessions.create(sessionParams);

    console.log('Stripe session created successfully:', { 
      sessionId: session.id, 
      url: session.url,
      hasUrl: !!session.url
    });

    if (!session.url) {
      console.error('No URL in session response');
      return NextResponse.json(
        { error: 'Failed to get checkout URL from Stripe. Session created but no URL returned.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Stripe checkout error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
