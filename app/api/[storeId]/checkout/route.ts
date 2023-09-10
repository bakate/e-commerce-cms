import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new Response("Product ids are required", { status: 422 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const product of products) {
    line_items.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100,
      },
      quantity: 1,
    });
  }

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: products.map((product) => ({
          product: {
            connect: {
              id: product.id,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",

    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    {
      url: session.url,
    },
    { headers: corsHeaders }
  );
}