"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Serialize the transaction to handle numeric fields properly
const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  return serialized; // Add a return statement
};

// Function to create an account
export async function createAccount(data) {
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

    // Convert balance to a float and validate it
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance provided");
    }

    // Check if this is the user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    // Determine if this account should be the default
    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If this account is default, update other accounts to non-default
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create the account
    const account = await db.account.create({
      data: {
        name: data.name,
        type: data.type,
        balance: balanceFloat,
        isDefault: shouldBeDefault,
        userId: user.id, // Ensure userId is linked
      },
    });

    // Serialize the account data
    const serializeAccount = serializeTransaction(account);

    // Revalidate the dashboard path
    revalidatePath("/dashboard");

    // Return success response
    return { success: true, data: serializeAccount };
  } catch (error) {
    throw new Error(error.message || "Failed to create account");
  }
}

// Function to get user accounts
export async function getUserAccounts() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      throw new Error("User not found");
    }

    // Fetch user accounts
    const accounts = await db.account.findMany({
      where: { userId: user.id },
    });

    // Serialize accounts
    const serializedAccounts = accounts.map((account) =>
      serializeTransaction(account)
    );

    // Return accounts
    return { success: true, data: serializedAccounts };
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user accounts");
  }
}
