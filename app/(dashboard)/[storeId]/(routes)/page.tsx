import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

const StorePage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 p-6 pt-8 space-y-4">
        <Heading title="Dashboard" description="overview of your store" />
        <Separator />
        <div className="grid gap-4 grid-cols-3">
          <p>hello</p>
          <p>hello</p>
          <p>hello</p>
        </div>
      </div>
    </div>
  );
};

export default StorePage;
