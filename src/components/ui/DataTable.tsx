// src/components/ui/DataTable.tsx
import { Fragment, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  getRowId: (row: T) => string | number;
  searchPlaceholder?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  groupBy?: keyof T | null;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading,
  onEdit,
  onDelete,
  getRowId,
  searchPlaceholder = 'Cari data...',
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  groupBy = null,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const activeColumnFilters = Object.entries(columnFilters).filter(([, value]) => value.trim() !== '');

    return data.filter((row) => {
      const matchesGlobalSearch =
        !normalizedQuery ||
        columns.some((column) => {
          const value = row[column.key];

          if (value === null || value === undefined) return false;
          if (typeof value === 'object') {
            return JSON.stringify(value).toLowerCase().includes(normalizedQuery);
          }

          return String(value).toLowerCase().includes(normalizedQuery);
        });

      if (!matchesGlobalSearch) return false;

      return activeColumnFilters.every(([key, filterValue]) => {
        const col = columns.find((c) => String(c.key) === key);

        let stringValue: string;
        if (col?.render) {
          const rendered = col.render(row);
          stringValue = typeof rendered === 'string' ? rendered : JSON.stringify(rendered);
        } else {
          const columnValue = row[key as keyof T];
          if (columnValue === null || columnValue === undefined) return false;
          stringValue = typeof columnValue === 'object' ? JSON.stringify(columnValue) : String(columnValue);
        }

        return stringValue.toLowerCase().includes(filterValue.trim().toLowerCase());
      });
    });
  }, [columns, data, columnFilters, query]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPageSafe - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [currentPageSafe, filteredData, rowsPerPage]);

  const groupedRows = useMemo(() => {
    if (!groupBy) return null;

    const groups = new Map<string, { label: string; rows: T[] }>();

    paginatedData.forEach((row) => {
      const value = row[groupBy];
      const groupKey = value == null ? 'empty' : typeof value === 'object' ? JSON.stringify(value) : String(value);
      const label = value == null ? 'Tidak ada nilai' : typeof value === 'object' ? JSON.stringify(value) : String(value);

      if (!groups.has(groupKey)) {
        groups.set(groupKey, { label, rows: [] });
      }

      groups.get(groupKey)?.rows.push(row);
    });

    return Array.from(groups.values());
  }, [groupBy, paginatedData]);

  const startItem = filteredData.length === 0 ? 0 : (currentPageSafe - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPageSafe * rowsPerPage, filteredData.length);

  const renderTableRow = (row: T) => {
    const rowId = getRowId(row);

    return (
      <tr key={String(rowId || 'row')} className="hover:bg-muted/30">
        {columns.map((col) => (
          <td key={String(col.key)} className="px-4 py-3 align-top">
            {col.render ? col.render(row) : String(row[col.key] ?? '')}
          </td>
        ))}
        {(onEdit || onDelete) && (
          <td className="space-x-1 px-4 py-3 text-right">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (rowId === undefined || rowId === null || rowId === '') {
                    console.warn('DataTable: attempted edit for row without a valid id', row);
                    return;
                  }
                  onEdit(row);
                }}
                aria-label={`Edit ${String(rowId ?? 'data')}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (rowId === undefined || rowId === null || rowId === '') {
                    console.warn('DataTable: attempted delete for row without a valid id', row);
                    return;
                  }
                  onDelete(row);
                }}
                aria-label={`Hapus ${String(rowId ?? 'data')}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </td>
        )}
      </tr>
    );
  };

  if (isLoading) {
    return <div className="py-10 text-center text-sm text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="flex flex-col gap-3 border-b bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row sm:items-center">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Cari data</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              aria-label="Cari data"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          {Object.keys(columnFilters).some((key) => columnFilters[key].trim()) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setColumnFilters({});
                setCurrentPage(1);
              }}
              aria-label="Reset filter kolom"
            >
              Reset filter
            </Button>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Baris per halaman</span>
          <select
            aria-label="Baris per halaman"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="rounded-md border border-input bg-background px-2 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredData.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          {query ? 'Tidak ada data yang cocok dengan pencarian.' : 'No data found.'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {columns.map((col) => (
                    <th key={String(col.key)} className="px-4 py-3 text-left font-medium">
                      {col.label}
                    </th>
                  ))}
                  {(onEdit || onDelete) && (
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  )}
                </tr>
                <tr className="bg-muted/20">
                  {columns.map((col) => {
                    const columnKey = String(col.key);
                    return (
                      <th key={`${columnKey}-filter`} className="px-3 py-2 align-top">
                        <input
                          type="text"
                          aria-label={`Filter kolom ${col.label}`}
                          value={columnFilters[columnKey] ?? ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setColumnFilters((prev) => ({
                              ...prev,
                              [columnKey]: value,
                            }));
                            setCurrentPage(1);
                          }}
                          placeholder={`Filter ${col.label}`}
                          className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                      </th>
                    );
                  })}
                  {(onEdit || onDelete) && <th className="px-3 py-2 text-right" />}
                </tr>
              </thead>
              <tbody className="divide-y">
                {groupBy && groupedRows ? (
                  groupedRows.map((group) => (
                    <Fragment key={group.label}>
                      <tr className="bg-muted/30 text-left">
                        <th
                          scope="rowgroup"
                          colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                          className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                        >
                          {group.label}
                        </th>
                      </tr>
                      {group.rows.map((row) => renderTableRow(row))}
                    </Fragment>
                  ))
                ) : (
                  paginatedData.map((row) => renderTableRow(row))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t bg-muted/20 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              Menampilkan {startItem}-{endItem} dari {filteredData.length} data
            </p>

            <div className="flex items-center gap-2" role="navigation" aria-label="Navigasi halaman tabel">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPageSafe === 1}
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="min-w-24 text-center text-sm font-medium text-muted-foreground" aria-live="polite">
                Halaman {currentPageSafe} / {totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPageSafe === totalPages}
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
