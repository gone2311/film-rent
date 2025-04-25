
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { supabase } from "@/lib/supabase";

type CompanyContextType = {
  companyName: string;
  setCompanyName: (name: string) => void;
  companyLogo: string | null;
  setCompanyLogo: (logo: string | null) => void;
  updateCompany: (name: string, logo: string | null) => Promise<void>;
};

const defaultCompanyContext: CompanyContextType = {
  companyName: "FilmRent",
  setCompanyName: () => {},
  companyLogo: null,
  setCompanyLogo: () => {},
  updateCompany: async () => {},
};

const CompanyContext = createContext<CompanyContextType>(defaultCompanyContext);

export const useCompany = () => useContext(CompanyContext);

type CompanyProviderProps = {
  children: ReactNode;
};

export const CompanyProvider = ({ children }: CompanyProviderProps) => {
  const [companyName, setCompanyName] = useState<string>("FilmRent");
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  const updateCompany = async (name: string, logo: string | null) => {
    try {
      // Update local state
      setCompanyName(name);
      setCompanyLogo(logo);

      // Update in Supabase
      const { error } = await supabase
        .from('company_settings')
        .upsert({ 
          id: 1, // We'll use a single row for company settings
          name: name,
          logo: logo
        });

      if (error) {
        console.error('Error updating company:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Load initial data from Supabase
  useEffect(() => {
    const loadCompanySettings = async () => {
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error loading company settings:', error);
          return;
        }

        if (data) {
          setCompanyName(data.name);
          setCompanyLogo(data.logo);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadCompanySettings();
  }, []);

  return (
    <CompanyContext.Provider
      value={{
        companyName,
        setCompanyName,
        companyLogo,
        setCompanyLogo,
        updateCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
