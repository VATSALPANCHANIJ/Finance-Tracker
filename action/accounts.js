"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized; // Add a return statement
};
export async function updateDefaultAccount(accountId) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Find the user in the database
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }
    await db.account.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: { isDefault: true },
    });
    revalidatePath("/dashboard");

    return { success: true, data: serializeTransaction(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function getAccountWithTransactions(accountId) {
  // Get authenticated user
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Find the user in the database
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const account = await db.account.findUnique({
    where: { id: accountId, userId: user.id },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!account) return null;
  return {
    ...serializeTransaction(account),
    transactions: account.transactions.map(serializeTransaction),
  };
}
export async function bulkDeleteTransactions(transactionIds) {
  console.log("Received for deletion:", transactionIds); // Debug log
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    console.log("Authenticated User:", userId);
    
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    console.log("Transactions before deletion:", await db.transaction.findMany({
      where: { id: { in: transactionIds }, userId: user.id },
    }));

    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });
    });

    console.log("Transactions deleted successfully");

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    console.error("Error in bulk delete:", error.message);
    return { success: false, error: error.message };
  }
}

