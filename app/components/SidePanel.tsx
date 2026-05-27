import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { ItemDescription, ItemTitle } from "./ui/item";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Ban, RefreshCcw } from "lucide-react";
import { Blocker } from "@/lib/blocker";

const SidePanel = () => {
  const [reqs, setReqs] = useState<any[]>([]);
  const [method, setMethod] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  //   const ex = [
  //     {
  //       method: "GET",
  //       tabId: "123",
  //       timeStamp: "123",
  //       type: "css",
  //       url: "http://url.com",
  //     },
  //   ];

  const MethodSelect = () => {
    return (
      <>
        <Select
          defaultValue="all"
          value={method}
          onValueChange={(val) => setMethod(val)}
        >
          <SelectTrigger className="uppercase">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["all", "get", "post", "headers"].map((method) => (
              <SelectItem key={method} value={method} className="uppercase">
                {method}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </>
    );
  };

  const TypeSelect = () => {
    return (
      <>
        <Select
          defaultValue="all"
          value={type}
          onValueChange={(val) => setType(val)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              "all",
              "stylesheet",
              "xmlhttprequest",
              "media",
              "image",
              "websocket",
            ].map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </>
    );
  };

  useEffect(() => {
    const port = chrome.runtime.connect({ name: "reqmon" });

    port.onMessage.addListener((msg: any) => {
      setReqs((prev) => [msg, ...prev]);
    });

    return () => {
      port.disconnect();
    };
  }, []);

  return (
    <>
      <div className="flex flex-col items-stretch gap-5 px-2 w-full h-screen no-scrollbar bg-background">
        <ItemTitle className="sticky top-0 font-extrabold text-2xl">
          Requests
        </ItemTitle>
        <div className="flex items-center justify-between">
          <MethodSelect />
          <TypeSelect />
          <Button
            onClick={async () => {
              const blocker = new Blocker();
              blocker.reset();
            }}
          >
            <RefreshCcw />
          </Button>
          <Button onClick={() => setReqs([])}>
            <Ban />
          </Button>
        </div>
        <div className="overflow-y-scroll h-full no-scrollbar flex flex-col items-stretch gap-2">
          {reqs
            .filter((req) => {
              const methodMatch =
                method === "all" || req.method === method.toUpperCase();
              const typeMatch = type === "all" || req.type === type;
              req.method === method.toUpperCase();

              return methodMatch && typeMatch;
            })
            .map((req, i) => (
              <div key={i} className="grid grid-cols-8 gap-5">
                <Badge className="rounded-sm!">{req.method}</Badge>
                <Badge className="rounded-sm! col-span-2">{req.type}</Badge>
                <ItemDescription className="col-span-3 text-nowrap overflow-x-scroll no-scrollbar">
                  <a href={req.url} target="_blank">
                    {req.url}
                  </a>
                </ItemDescription>
                <Badge className="rounded-sm!">
                  {new Date(req.timeStamp).toLocaleTimeString()}
                </Badge>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default SidePanel;
