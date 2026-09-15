import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { apiClient } from "@/admin/api/client";

/** Downloads a CSV from an admin export endpoint, matching the pattern already used by Newsletter's export. */
export function useExportCsv(endpoint: string, filename: string) {
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);

  async function exportCsv(params?: Record<string, unknown>) {
    setExporting(true);
    try {
      const res = await apiClient.get(endpoint, { params, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error(t("common.exportFailed"));
    } finally {
      setExporting(false);
    }
  }

  return { exportCsv, exporting };
}
