import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminSidebarContextType {
  isApplicationExpanded: boolean;
  setIsApplicationExpanded: (val: boolean) => void;
  isProductsExpanded: boolean;
  setIsProductsExpanded: (val: boolean) => void;
  isUsersExpanded: boolean;
  setIsUsersExpanded: (val: boolean) => void;
  isOrdersExpanded: boolean;
  setIsOrdersExpanded: (val: boolean) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export const AdminSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isApplicationExpanded, setIsApplicationExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('sdazum_isApplicationExpanded');
    return saved !== null ? saved === 'true' : true;
  });
  const [isProductsExpanded, setIsProductsExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('sdazum_isProductsExpanded');
    return saved !== null ? saved === 'true' : true;
  });
  const [isUsersExpanded, setIsUsersExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('sdazum_isUsersExpanded');
    return saved !== null ? saved === 'true' : true;
  });
  const [isOrdersExpanded, setIsOrdersExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('sdazum_isOrdersExpanded');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('sdazum_isApplicationExpanded', String(isApplicationExpanded));
  }, [isApplicationExpanded]);

  useEffect(() => {
    localStorage.setItem('sdazum_isProductsExpanded', String(isProductsExpanded));
  }, [isProductsExpanded]);

  useEffect(() => {
    localStorage.setItem('sdazum_isUsersExpanded', String(isUsersExpanded));
  }, [isUsersExpanded]);

  useEffect(() => {
    localStorage.setItem('sdazum_isOrdersExpanded', String(isOrdersExpanded));
  }, [isOrdersExpanded]);

  const expandAll = () => {
    setIsApplicationExpanded(true);
    setIsProductsExpanded(true);
    setIsUsersExpanded(true);
    setIsOrdersExpanded(true);
  };

  const collapseAll = () => {
    setIsApplicationExpanded(false);
    setIsProductsExpanded(false);
    setIsUsersExpanded(false);
    setIsOrdersExpanded(false);
  };

  return (
    <AdminSidebarContext.Provider
      value={{
        isApplicationExpanded,
        setIsApplicationExpanded,
        isProductsExpanded,
        setIsProductsExpanded,
        isUsersExpanded,
        setIsUsersExpanded,
        isOrdersExpanded,
        setIsOrdersExpanded,
        expandAll,
        collapseAll,
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
};

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (context === undefined) {
    throw new Error('useAdminSidebar must be used within an AdminSidebarProvider');
  }
  return context;
};
