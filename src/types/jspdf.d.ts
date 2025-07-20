// src/types/jspdf.d.ts

declare module 'jspdf' {
  interface jsPDF {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    autoTable: (options: any) => jsPDF; 
  }
}