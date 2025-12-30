import type { ReactNode } from "react";
import AuthHeroPanel from "./AuthHeroPanel";

type AuthLayoutProps = {
  heroTitle: ReactNode;
  heroDescription: ReactNode;
  heroImageAlt: string;
  topAction?: ReactNode;
  contentClassName?: string;
  children: ReactNode;
};

const AuthLayout = ({
  heroTitle,
  heroDescription,
  heroImageAlt,
  topAction,
  contentClassName,
  children,
}: AuthLayoutProps) => {
  const contentClasses = `flex flex-1 items-center justify-center px-6 py-10 sm:px-10${contentClassName ? ` ${contentClassName}` : ""}`;

  return (
    <div className="grid min-h-screen bg-white lg:h-screen lg:grid-cols-2">
      <AuthHeroPanel title={heroTitle} description={heroDescription} imageAlt={heroImageAlt} />

      <div className="flex flex-col bg-white">
        {topAction ? <div className="flex justify-end px-6 pt-6 sm:px-10">{topAction}</div> : null}
        <div className={contentClasses}>{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
