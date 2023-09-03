import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import * as z from "zod";

import prismadb from "@/lib/prismadb";
import { colorsFormSchema } from "@/schemas";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { value, name } = colorsFormSchema.parse(body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 422 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized to perform this action", {
        status: 401,
      });
    }

    const color = await prismadb.color.create({
      data: {
        value,
        name,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("[COLORS_POST]", error);
      return new NextResponse("Invalid type or data provided", { status: 422 });
    } else {
      console.log("[COLORS_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 422 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
