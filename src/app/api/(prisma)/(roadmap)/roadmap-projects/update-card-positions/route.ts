import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { handlePrismaError } from "@/src/lib/prismaErrorHandler";

const prisma = new PrismaClient();

// TODO - Remove PATCH method and create server action
