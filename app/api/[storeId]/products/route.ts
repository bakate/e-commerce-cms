import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import * as z from "zod";

import prismadb from "@/lib/prismadb";
import { productFormSchema } from "@/schemas";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      categoryId,
      colors,
      images,
      name,
      price,
      sizes,
      isArchived,
      isFeatured,
      description,
    } = productFormSchema.parse(body);

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

    const product = await prismadb.product.create({
      data: {
        categoryId,
        isArchived,
        isFeatured,
        price,
        sizes: {
          connect: sizes.map((size) => ({ id: size.id })),
        },
        colors: {
          connect: colors.map((color) => ({ id: color.id })),
        },
        name,
        description,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("[PRODUCTS_POST]", error);
      return new NextResponse("Invalid type or data provided", { status: 422 });
    } else {
      console.log("[PRODUCTS_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colors = searchParams.get("colors") || undefined;
    const sizes = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        colors: true,
        sizes: true,
      },

      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
