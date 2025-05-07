
import React from "react";
import DatabaseExporter from "@/components/exports/DatabaseExporter";

const DatabaseExport = () => {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Xuất dữ liệu Database</h2>
      </div>
      
      <div className="grid gap-4 grid-cols-1">
        <DatabaseExporter />
      </div>
    </div>
  );
};

export default DatabaseExport;
