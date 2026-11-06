import { useEffect, useMemo, useRef, useState } from 'react';
import { HiChevronDown, HiChevronLeft, HiChevronRight, HiChevronUp, HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import Skeleton from './Skeleton';

/**
 * DataTable — one table for the whole workspace.
 *
 * Sorting, pagination, row selection, a bulk-action bar and a card fallback on
 * phones, so list pages stop re-implementing <table> with slightly different
 * behaviour every time.
 *
 * columns: [{
 *   key, header, align?: 'left'|'right'|'center',
 *   render?: (row) => node, sortValue?: (row) => string|number,
 *   sortable?: boolean, className?: string,
 *   hideBelow?: 'sm'|'md'|'lg'    // mirrors Tailwind's breakpoint on the cell
 * }]
 */
const PAGE_SIZES = [8, 15, 30];

const showClass = (hideBelow) => {
  if (!hideBelow) return '';
  return { sm: 'hidden sm:table-cell', md: 'hidden md:table-cell', lg: 'hidden lg:table-cell' }[hideBelow] || '';
};

const cellAlign = (align) =>
  align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';

const DataTable = ({
  columns = [],
  rows = [],
  rowKey = (row) => row._id ?? row.id,
  isLoading = false,
  skeletonRows = 5,
  emptyState = null,
  selectable = false,
  bulkActions = null,
  onRowClick,
  initialSort = null,
  pageSize: initialPageSize = 8,
  footerNote = null,
  renderMobileCard = null,
  className,
}) => {
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(initialPageSize);
  const [selected, setSelected] = useState(() => new Set());
  const headCheckbox = useRef(null);

  const keyOf = (row) => String(rowKey(row));

  // A record that disappears (deleted, filtered out) must leave the selection.
  useEffect(() => {
    setSelected((prev) => {
      if (prev.size === 0) return prev;
      const live = new Set(rows.map(keyOf));
      const next = new Set([...prev].filter((id) => live.has(id)));
      return next.size === prev.size ? prev : next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const sorted = useMemo(() => {
    if (!sort?.key) return rows;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return rows;
    const value = column.sortValue || ((row) => row[column.key]);
    return [...rows].sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      if (av == null) return 1;
      if (bv == null) return -1;
      const result =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === 'asc' ? result : -result;
    });
  }, [rows, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / size));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * size;
  const visible = sorted.slice(start, start + size);
  const allOnPageSelected =
    visible.length > 0 && visible.every((row) => selected.has(keyOf(row)));

  useEffect(() => {
    if (headCheckbox.current) {
      headCheckbox.current.indeterminate = selected.size > 0 && !allOnPageSelected;
    }
  }, [selected, allOnPageSelected]);

  const toggleSort = (column) => {
    if (!column.sortable) return;
    setSort((prev) => {
      if (prev?.key !== column.key) return { key: column.key, dir: 'asc' };
      if (prev.dir === 'asc') return { key: column.key, dir: 'desc' };
      return null;
    });
    setPage(0);
  };

  const toggleRow = (row) => {
    const id = keyOf(row);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) visible.forEach((row) => next.delete(keyOf(row)));
      else visible.forEach((row) => next.add(keyOf(row)));
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());
  const selectedRows = rows.filter((row) => selected.has(keyOf(row)));
  const columnCount = columns.length + (selectable ? 1 : 0);

  /* ---------------------------------------------------------------- loading */
  if (isLoading) {
    return (
      <div className={cn('bg-surface shadow-card', className)}>
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="hidden h-3 w-20 sm:block" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------- empty */
  if (rows.length === 0) {
    return <div className={cn('bg-surface shadow-card', className)}>{emptyState}</div>;
  }

  return (
    <div className={cn('bg-surface shadow-card', className)}>
      {/* bulk action bar */}
      {selectable && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 border-b border-border-subtle bg-accent-subtle px-4 py-2.5">
          <span className="text-[13px] font-semibold text-foreground">
            {selected.size} selected
          </span>
          <button
            type="button"
            onClick={clearSelection}
            className="inline-flex items-center gap-1 text-[13px] text-foreground-muted hover:text-foreground"
          >
            <HiX className="h-3.5 w-3.5" /> Clear
          </button>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {bulkActions ? bulkActions(selectedRows, clearSelection) : null}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------- desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border-default bg-surface-subtle/60">
              {selectable && (
                <th scope="col" className="w-10 px-4 py-2.5">
                  <input
                    ref={headCheckbox}
                    type="checkbox"
                    aria-label="Select all rows on this page"
                    checked={allOnPageSelected}
                    onChange={togglePage}
                    className="h-3.5 w-3.5 accent-[var(--accent-primary)]"
                  />
                </th>
              )}
              {columns.map((column) => {
                const active = sort?.key === column.key;
                const ariaSort = active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none';
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={column.sortable ? ariaSort : undefined}
                    className={cn(
                      'px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.13em] text-foreground-muted',
                      cellAlign(column.align),
                      showClass(column.hideBelow),
                      column.className
                    )}
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column)}
                        className={cn(
                          'inline-flex items-center gap-1 uppercase tracking-[0.13em] transition-colors hover:text-foreground',
                          active ? 'text-foreground' : ''
                        )}
                      >
                        {column.header}
                        {active ? (
                          sort.dir === 'asc' ? (
                            <HiChevronUp className="h-3 w-3" />
                          ) : (
                            <HiChevronDown className="h-3 w-3" />
                          )
                        ) : (
                          <HiChevronDown className="h-3 w-3 opacity-30" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {visible.map((row) => {
              const id = keyOf(row);
              const isSelected = selected.has(id);
              return (
                <tr
                  key={id}
                  data-state={isSelected ? 'selected' : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'transition-colors hover:bg-surface-subtle/60',
                    isSelected && 'bg-accent-subtle',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {selectable && (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`Select row ${id}`}
                        checked={isSelected}
                        onChange={() => toggleRow(row)}
                        className="h-3.5 w-3.5 accent-[var(--accent-primary)]"
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 align-middle text-[13px] text-foreground-secondary',
                        cellAlign(column.align),
                        showClass(column.hideBelow),
                        column.className
                      )}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ---------------------------------------------------------- mobile */}
      <div className="divide-y divide-border-subtle md:hidden">
        {selectable && (
          <div className="flex items-center gap-2 bg-surface-subtle/60 px-4 py-2">
            <input
              type="checkbox"
              aria-label="Select all rows on this page"
              checked={allOnPageSelected}
              onChange={togglePage}
              className="h-3.5 w-3.5 accent-[var(--accent-primary)]"
            />
            <span className="text-[11px] font-semibold uppercase tracking-[0.13em] text-foreground-muted">
              Select all
            </span>
          </div>
        )}
        {visible.map((row) => {
          const id = keyOf(row);
          const isSelected = selected.has(id);
          return (
            <div
              key={id}
              className={cn('flex items-start gap-3 px-4 py-4', isSelected && 'bg-accent-subtle')}
            >
              {selectable && (
                <input
                  type="checkbox"
                  aria-label={`Select row ${id}`}
                  checked={isSelected}
                  onChange={() => toggleRow(row)}
                  className="mt-1 h-3.5 w-3.5 shrink-0 accent-[var(--accent-primary)]"
                />
              )}
              <div className="min-w-0 flex-1" onClick={onRowClick ? () => onRowClick(row) : undefined}>
                {renderMobileCard ? (
                  renderMobileCard(row)
                ) : (
                  <dl className="space-y-1">
                    {columns
                      .filter((c) => !c.hideMobile)
                      .map((column) => (
                        <div key={column.key} className="flex items-baseline gap-3">
                          <dt className="w-24 shrink-0 text-[11px] uppercase tracking-[0.1em] text-foreground-muted">
                            {column.header}
                          </dt>
                          <dd className="min-w-0 flex-1 text-[13px] text-foreground-secondary">
                            {column.render ? column.render(row) : row[column.key]}
                          </dd>
                        </div>
                      ))}
                  </dl>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------- footer */}
      <div className="flex flex-col gap-3 border-t border-border-subtle px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-[12px] text-foreground-muted">
          <span className="font-mono">
            {sorted.length === 0 ? 0 : start + 1}–{Math.min(start + size, sorted.length)} of{' '}
            {sorted.length}
          </span>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(0);
            }}
            aria-label="Rows per page"
            className="rounded-md border border-border-default bg-surface px-1.5 py-1 text-[12px] text-foreground-secondary"
          >
            {PAGE_SIZES.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
          {footerNote}
        </div>

        {pageCount > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              aria-label="Previous page"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border-default text-foreground-secondary disabled:opacity-40 enabled:hover:bg-surface-subtle"
            >
              <HiChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="px-2 font-mono text-[12px] text-foreground-secondary">
              {safePage + 1} / {pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage >= pageCount - 1}
              aria-label="Next page"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border-default text-foreground-secondary disabled:opacity-40 enabled:hover:bg-surface-subtle"
            >
              <HiChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      <span className="sr-only">{columnCount} columns</span>
    </div>
  );
};

export default DataTable;
