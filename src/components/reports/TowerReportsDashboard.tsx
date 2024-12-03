"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Button,
  Input,
} from "@nextui-org/react";
import { Cog, FileText, Pencil, Trash2 } from "lucide-react";

import { TowerReport } from "@/src/types/reports";
import { SearchIcon } from "@/components/icons";

export const TowerReportsDashboard = ({
  canDeleteReports,
}: {
  canDeleteReports: boolean;
}) => {
  const [towerReports, setTowerReports] = useState<TowerReport[]>([]);
  const [filterValue, setFilterValue] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/prisma-tower-reports-dashboard");
        const data = await response.json();

        setTowerReports(data);
      } catch (error) {
        console.error("Failed to fetch tower reports:", error);
      }
    }
    fetchData();
  }, []);

  const filteredReports = React.useMemo(() => {
    return towerReports.filter((report) =>
      report.jde_work_order.toLowerCase().includes(filterValue.toLowerCase()),
    );
  }, [towerReports, filterValue]);

  const onSearchChange = React.useCallback((value: string) => {
    setFilterValue(value);
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
  }, []);

  const handleDelete = async (reportId: string) => {
    try {
      const response = await fetch(`/api/prisma-tower-report?id=${reportId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch report: ${response.statusText}`);
      }
      const report = await response.json();

      for (const imageType of [
        "front_image",
        "site_images",
        "deficiency_images",
      ]) {
        for (const image of report[imageType]) {
          const subdir = `${report.jde_job}-${report.jde_work_order}`;

          try {
            await fetch(
              `/api/azure-report-images/delete?subdir=${subdir}&azureId=${image.azureId}`,
              {
                method: "DELETE",
              },
            );
          } catch (error) {
            console.error(
              `Failed to delete image from Azure: ${image.azureId}`,
              error,
            );
          }
        }
      }

      await fetch(`/api/prisma-tower-report/delete?id=${reportId}`, {
        method: "DELETE",
      });

      setTowerReports((prev) =>
        prev.filter((report) => report.id !== reportId),
      );
    } catch (error) {
      console.error("Failed to delete tower report:", error);
    }
  };

  const handleEdit = (reportId: string) => {
    router.push(`/reports/${reportId}`);
  };

  const handleCreate = () => {
    router.push("/reports/new");
  };

  const handleGeneratePDF = (reportId: string) => {
    window.open(`/pdf/rogers/${reportId}`, "_blank");
    // window.open(`/api/pdf/${reportId}`, "_blank");
  };

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <Input
          isClearable
          aria-label="search-bar"
          className="h-10 w-1/2"
          classNames={{
            input:
              "text-sm border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0",
            inputWrapper: "bg-background border border-primary",
          }}
          color="primary"
          placeholder="Search by Work Order..."
          radius="full"
          startContent={
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
          }
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <Button
          className="bg-primary text-white h-10"
          radius="full"
          variant="solid"
          onClick={handleCreate}
        >
          Create New Report
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mt-10 w-full">
      <div className="overflow-x-auto">
        <Table
          isHeaderSticky
          removeWrapper
          aria-label="tower-reports-dashboard"
          classNames={{
            base: "text-left",
            th: "uppercase bg-foreground text-background",
          }}
          color="primary"
          selectionMode="single"
          topContent={topContent}
        >
          <TableHeader>
            {/* <TableColumn key="created" className="text-center">Created</TableColumn> */}
            <TableColumn key="created" className="text-center">
              Created
            </TableColumn>
            <TableColumn key="updated" className="text-center">
              Updated
            </TableColumn>
            <TableColumn key="jde_wo" className="text-center">
              JDE WO
            </TableColumn>
            <TableColumn key="jde_job" className="text-center">
              JDE Job #
            </TableColumn>
            <TableColumn key="site_name">Site Name</TableColumn>
            <TableColumn key="site_code" className="text-center">
              Site Code
            </TableColumn>
            <TableColumn key="tower_id" className="text-center">
              Tower ID
            </TableColumn>
            <TableColumn key="job_revision" className="text-center">
              Revision
            </TableColumn>
            <TableColumn key="job_description" className="text-center">
              Job
            </TableColumn>
            <TableColumn key="design_standard" className="text-center">
              Standard
            </TableColumn>
            <TableColumn key="company" className="text-center">
              Cie
            </TableColumn>
            <TableColumn key="actions">
              <div className="flex items-center justify-center w-full h-full">
                <Cog />
              </div>
            </TableColumn>
          </TableHeader>
          <TableBody emptyContent="No entries found" items={filteredReports}>
            {(report) => (
              <TableRow key={report.id}>
                <TableCell className="text-center text-nowrap">
                  {new Date(report.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {new Date(report.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {report.jde_work_order}
                </TableCell>
                <TableCell className="text-center">{report.jde_job}</TableCell>
                <TableCell>{report.site_name}</TableCell>
                <TableCell className="text-center text-nowrap">
                  {report.site_code}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {report.tower_id}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {report.job_revision}
                </TableCell>
                <TableCell className="text-center">
                  {report.job_description}
                </TableCell>
                <TableCell className="text-center">
                  {report.design_standard}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  {report.client_company}
                </TableCell>
                <TableCell className="text-center text-nowrap">
                  <div className="space-x-2 inline-block">
                    <Button
                      isIconOnly
                      color="success"
                      size="sm"
                      variant="bordered"
                      onClick={() => handleEdit(report.id)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      isIconOnly
                      color="primary"
                      size="sm"
                      type="button"
                      variant="bordered"
                      onClick={() => handleGeneratePDF(report.id)}
                    >
                      <FileText />
                    </Button>
                    {canDeleteReports && (
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="bordered"
                        onClick={() => handleDelete(report.id)}
                      >
                        <Trash2 />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
