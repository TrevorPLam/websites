interface TenantFiltersProps {
  initialSearch?: string;
  initialStatus?: string;
}

export function TenantFilters({ initialSearch, initialStatus }: TenantFiltersProps) {
  return (
    <form className="flex gap-3">
      <input
        type="search"
        name="search"
        defaultValue={initialSearch}
        placeholder="Search domain or name…"
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-primary"
        aria-label="Search tenants"
      />
      <select
        name="status"
        defaultValue={initialStatus}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="trial">Trial</option>
        <option value="suspended">Suspended</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button
        type="submit"
        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium"
      >
        Search
      </button>
    </form>
  );
}
