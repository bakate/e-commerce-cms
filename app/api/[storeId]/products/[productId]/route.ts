import * as z from "zod";

import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { productFormSchema } from "@/schemas";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      categoryId,
      colors,
      description,
      images,
      price,
      sizes,
      isArchived,
      isFeatured,
      name,
    } = productFormSchema.parse(body);

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 422 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 422 });
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

    const existingProduct = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        colors: true,
        sizes: true,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        categoryId,
        colors: {
          set: colors.map((color) => ({ id: color.id.toString() })),
        },
        description,
        price,
        sizes: {
          set: sizes.map((size) => ({ id: size.id.toString() })),
          // we disconnect all the sizes first that are not in the new sizes
        },
        isArchived,
        isFeatured,
        images: {
          deleteMany: {},
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("[CATEGORY_PATCH]", error);
      return new NextResponse("Invalid type or data provided", { status: 422 });
    } else {
      console.log("[CATEGORY_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 422 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        sizes: true,
        category: true,
        colors: true,
        images: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 422 });
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
    // we need to delete the order items first
    await prismadb.orderItem.deleteMany({
      where: {
        productId: params.productId,
      },
    });

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
      include: {
        sizes: true,
        colors: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
