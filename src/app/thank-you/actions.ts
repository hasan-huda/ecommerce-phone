"use server";

import { db } from "@/db";
import { UserNew } from "../configure/preview/DesignPreview";

export const getPaymentStatus = async ({
  user, orderId
}: {
  user: UserNew | null,
  orderId: string
}) => {
  if (!user?.uid || !user.email) {
    throw new Error('You need to be logged in to view this page.')
  }
  
  const order = await db.order.findFirst({
    where: { id: orderId, userId: user.uid },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true,
    },
  })

  if (!order) throw new Error('This order does not exist.')

    if (order.isPaid) {
      return order
    } else {
      return false
    }
};
