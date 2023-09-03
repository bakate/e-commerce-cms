import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import * as z from "zod";

import prismadb from "@/lib/prismadb";
import { sizesFormSchema } from "@/schemas";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { value, name } = sizesFormSchema.parse(body);

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

    const size = await prismadb.size.create({
      data: {
        value,
        name,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("[SIZES_POST]", error);
      return new NextResponse("Invalid type or data provided", { status: 422 });
    } else {
      console.log("[SIZES_POST]", error);
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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
