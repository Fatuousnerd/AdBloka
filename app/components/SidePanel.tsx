import { Blocker } from "@/lib/blocker";
import { ItemDescription, ItemTitle } from "./ui/item";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useEffect, useState } from "react";
import { Ban } from "lucide-react";

const SidePanel = () => {
  const [rules, setRules] = useState<chrome.declarativeNetRequest.Rule[]>([]);

  useEffect(() => {
    const blocker = new Blocker();
    (async () => {
      setRules(await blocker.getBlocked());
    })();
  }, []);

  return (
    <>
      <div className="w-full h-full flex flex-col items-stretch gap-4 p-2">
        <ItemTitle className="font-bold text-2xl">
          AdBloka: OSS Free Ad-Blocker
        </ItemTitle>
        <Card className="p-0">
          <CardHeader className="p-0 items-start">
            <CardTitle className="font-semibold">Blocked Domains</CardTitle>
          </CardHeader>
          <CardContent>
            {rules.map((rule) => (
              <div key={rule.id} className="grid grid-cols-10 gap-4 bg-blue500">
                <ItemDescription>{rules.indexOf(rule) + 1}</ItemDescription>
                <ItemDescription className="col-span-6 text-primary font-semibold text-nowrap overflow-x-scroll no-scrollbar">
                  {rule.condition.urlFilter}
                </ItemDescription>
                <Button
                  variant={"destructive"}
                  className="col-span-3"
                  onClick={async () => {
                    const blocker = new Blocker();
                    blocker.unblock(rule.id);
                    setRules(await blocker.getBlocked());
                  }}
                >
                  <Ban /> Unblock
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SidePanel;
