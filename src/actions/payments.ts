"use server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const getStripePaymentIntentToken = async (amount: number) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "brl",
      automatic_payment_methods: {
        enabled: true,
      },
      description: "Pagamento Bambu Burguer",
    });
    return {
      success: true,
      data: paymentIntent.client_secret,
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};
