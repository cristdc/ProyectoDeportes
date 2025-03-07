import React from 'react';
import { Toaster } from 'sonner';

export const ToasterWrapper = ({ children }) => {
  return (
    <>
      {children}
      <Toaster 
        position="top-right"
        expand={false}
        richColors
        closeButton
      />
    </>
  );
}; 