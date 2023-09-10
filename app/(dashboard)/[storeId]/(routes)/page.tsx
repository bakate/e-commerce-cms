import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getStockCount } from "@/actions/get-stock-count";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import Overview from "@/components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { currencyFormatter } from "@/lib/utils";
import { CreditCard, Euro, Package } from "lucide-react";

type StorePageProps = {
  params: {
    storeId: string;
  };
};

const StorePage = async ({ params: { storeId } }: StorePageProps) => {
  const totalRevenue = await getTotalRevenue(storeId);
  const salesCount = await getSalesCount(storeId);
  const stockCount = await getStockCount(storeId);
  const graphRevenue = await getGraphRevenue(storeId);
  return (
    <div className="flex-col">
      <div className="flex-1 p-6 pt-8 space-y-4">
        <Heading title="Dashboard" description="overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <Card>
            <CardHeader className="flex items-center flex-row justify-between space-y-0">
              <CardTitle className="font-medium text-sm">
                Total Revenue
              </CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencyFormatter(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center flex-row justify-between space-y-0">
              <CardTitle className="font-medium text-sm">Sales</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{salesCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center flex-row justify-between space-y-0">
              <CardTitle className="font-medium text-sm">
                Products In Stock
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StorePage;
