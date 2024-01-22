import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { Button } from "./ui/button";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

const UiButton: FC<Props> = (props: Props) => {
  return (
    <Button
      className={cn(
        "font-rubik h-auto rounded-lg bg-purple-600 px-5 py-2.5 hover:bg-purple-700",
        props.className,
      )}
    >
      {props.children}
    </Button>
  );
};

export default UiButton;
