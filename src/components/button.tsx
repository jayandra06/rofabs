import { cn } from "@/lib/utils";
import React, { FC } from "react";
import { Button } from "./ui/button";

type Props = {
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const UiButton: FC<Props> = (props: Props) => {
  return (
    <Button
      className={cn(
        "h-auto rounded-lg bg-purple-600 px-5 py-2.5 font-rubik hover:bg-purple-700",
        props.className,
      )}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default UiButton;
