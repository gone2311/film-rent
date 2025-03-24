
import React, { createContext, useState, useContext, ReactNode } from "react";

type CompanyContextType = {
  companyName: string;
  setCompanyName: (name: string) => void;
  companyLogo: string | null;
  setCompanyLogo: (logo: string | null) => void;
};

const defaultCompanyContext: CompanyContextType = {
  companyName: "FilmRent",
  setCompanyName: () => {},
  companyLogo: null,
  setCompanyLogo: () => {},
};

const CompanyContext = createContext<CompanyContextType>(defaultCompanyContext);

export const useCompany = () => useContext(CompanyContext);

type CompanyProviderProps = {
  children: ReactNode;
};

export const CompanyProvider = ({ children }: CompanyProviderProps) => {
  const [companyName, setCompanyName] = useState<string>("FilmRent");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  return (
    <CompanyContext.Provider
      value={{
        companyName,
        setCompanyName,
        companyLogo,
        setCompanyLogo,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
