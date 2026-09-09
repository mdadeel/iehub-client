import { useState } from 'react';
import { useOrgs } from '../context/OrgsContext';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { cn } from '@/lib/utils';
import { HiOfficeBuilding, HiChevronDown, HiPlus, HiCheck } from 'react-icons/hi';

export default function OrganizationSwitcher({ compact = false }) {
    const { orgs, activeOrg, activeOrgId, switchOrg } = useOrgs();
    const [open, setOpen] = useState(false);

    if (!orgs.length) {
        return (
            <div className="flex items-center gap-2 text-xs">
                <Badge variant="warning" size="sm">No org</Badge>
                <Button size="sm" variant="ghost" asChild><a href="/organizations/new">Create</a></Button>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs font-medium bg-surface hover:bg-surface-hover",
                    compact ? "h-7" : "h-8"
                )}
                aria-haspopup="menu"
            >
                <HiOfficeBuilding className="w-3.5 h-3.5 text-foreground-muted" />
                <span className="max-w-[14ch] truncate">{activeOrg?.legalName || 'Select org'}</span>
                <Badge variant="secondary" size="sm">{activeOrg?.myRole || activeOrg?.type || ''}</Badge>
                <HiChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
                <div className="absolute left-0 top-full mt-1.5 w-72 bg-surface border border-border-default rounded-lg shadow-xl p-1.5 z-50 text-xs">
                    {orgs.map(o => (
                        <button
                            key={String(o._id)}
                            onClick={() => { switchOrg(o._id); setOpen(false); }}
                            className={cn("w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-left", String(o._id) === activeOrgId ? "bg-surface-subtle border border-border-default" : "hover:bg-surface-hover")}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{o.legalName}</div>
                                <div className="text-[11px] text-foreground-muted truncate">{o.slug} • {o.myRole}</div>
                            </div>
                            {String(o._id) === activeOrgId && <HiCheck className="w-4 h-4 text-accent-primary" />}
                        </button>
                    ))}
                    <div className="border-t border-border-subtle my-1" />
                    <a href="/organizations/new" className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-surface-hover">
                        <HiPlus className="w-4 h-4" /> Create organization
                    </a>
                </div>
            )}
        </div>
    );
}
