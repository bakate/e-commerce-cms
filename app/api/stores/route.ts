import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import * as z from "zod";

import prismadb from "@/lib/prismadb";
import { settingsFormSchema } from "@/schemas";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { name } = settingsFormSchema.parse(body);

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("[STORES_POST]", error);
      return new NextResponse("Invalid type or data provided", { status: 422 });
    } else {
      console.log("[STORES_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
}
