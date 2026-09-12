import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
            <div className="flex items-center gap-1.5 text-xs">
                <Badge variant="warning" size="sm">No org</Badge>
                <Button size="icon" variant="ghost" className="h-7 w-7 text-foreground-muted hover:text-foreground" asChild title="Create Organization" aria-label="Create Organization">
                    <a href="/organizations/new">
                        <HiPlus className="w-3.5 h-3.5" />
                    </a>
                </Button>
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
                aria-expanded={open}
            >
                <HiOfficeBuilding className="w-3.5 h-3.5 text-foreground-muted" />
                <span className="max-w-[14ch] truncate">{activeOrg?.legalName || 'Select org'}</span>
                <Badge variant="secondary" size="sm">{activeOrg?.myRole || activeOrg?.type || ''}</Badge>
                <HiChevronDown className={cn("w-3 h-3 transition-transform", open && "rotate-180")} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 2, scale: 0.96 }}
                        transition={{ duration: 0.12 }}
                        style={{ transformOrigin: 'top left' }}
                        className="absolute left-0 top-full mt-1.5 w-72 bg-surface border border-border-default rounded-lg shadow-xl p-1.5 z-50 text-xs"
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
