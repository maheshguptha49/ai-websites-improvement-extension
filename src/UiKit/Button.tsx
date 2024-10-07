import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
};

const Button: React.FC<Props> = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

export default Button;
