"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/product";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { Order } from "@prisma/client";
import { UserNew } from "./DesignPreview";

export const createUserIfNotExists = async (user: UserNew| null) => {
  if (!user?.uid || !user.email) {
    throw new Error("Invalid user data");
  }
  const existingUser = await db.user.findFirst({
    where: { id: user?.uid },
  });

  if (!existingUser) {
    console.log("Creating user");
    await db.user.create({
      data: {
        id: user.uid,
        email: user.email,
      },
    });
  }
  return { success: true }
};


export const createCheckoutSession = async ({
  configId,
  user
}: {
  configId: string,
  user: UserNew | null
}) => {
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  })

  if (!configuration) {
    throw new Error('No such configuration found')
  }

  if (!user) {
    throw new Error('You need to be logged in')
  }

  await createUserIfNotExists(user);


  const { finish, material } = configuration

  let price = BASE_PRICE
  if (finish === 'textured') price += PRODUCT_PRICES.finish.textured
  if (material === 'polycarbonate')
    price += PRODUCT_PRICES.material.polycarbonate

  let order: Order | undefined = undefined

  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.uid,
      configurationId: configuration.id,
    },
  })

  if (existingOrder) {
    order = existingOrder
  } else {
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.uid,
        configurationId: configuration.id,
      },
    })
  }

  const product = await stripe.products.create({
    name: 'Custom iPhone Case',
    images: [configuration.imageUrl],
    default_price_data: {
      currency: 'USD',
      unit_amount: price,
    },
  })

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ['card'],
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['DE', 'US'] },
    metadata: {
      userId: user.uid,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  })

  return { url: stripeSession.url }
}