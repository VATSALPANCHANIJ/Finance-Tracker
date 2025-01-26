
import CreateAccountDrawer from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AccountCard from "./_components/account-card";
import { getUserAccounts } from "@/action/dashboard";
import { getCurrentBudget } from "@/action/budget";
import BudgetProgress from "./_components/budget-progress";

export default async function DashboardPage() {

  const accounts = await getUserAccounts();

  const defaultAccount = accounts?.find((account) => account.isDefault);
  let budgetData = null;
  if (defaultAccount) {
    budgetData = await getCurrentBudget(defaultAccount.id);
  }
  console.log(budgetData);

  return <div className="space-y-8">
    {/* budget Progress */}
    {defaultAccount && <BudgetProgress
      initialBudget={budgetData?.budget}
      currentExpenses={budgetData?.currentExpenses || 0}
    />

    }
    {/* Over view */}

    {/* Accounts Grid */}
    <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-3">
      <CreateAccountDrawer>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed">
          <CardContent className="flex flex-col justify-center items-center text-muted-foreground h-full pt-5 ">
            <Plus className="h-10 w-10 " />

            <p className="text-sm font-medium">Add New Account</p>
          </CardContent>
        </Card>
      </CreateAccountDrawer>
      {accounts.length > 0 &&
        accounts?.map((account) => {
          return <AccountCard key={account.id} account={account} />
        })}
    </div>
  </div>;
}



