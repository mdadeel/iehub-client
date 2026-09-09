/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';

export const OrgsContext = createContext(null);

export function useOrgs() {
    return useContext(OrgsContext);
}

export function OrgsProvider({ children }) {
    const { user } = useAuth();
    const [orgs, setOrgs] = useState([]);
    const [activeOrgId, setActiveOrgId] = useState(() => localStorage.getItem('activeOrgId') || '');
    const [loading, setLoading] = useState(false);

    const fetchOrgs = useCallback(async () => {
        if (!user || user.isGuest) {
            setOrgs([]);
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.get('/organizations/mine');
            const list = Array.isArray(data) ? data : [];
            setOrgs(list);
            if (list.length && !activeOrgId) {
                const firstId = String(list[0]._id || list[0].org?._id);
                if (firstId) {
                    localStorage.setItem('activeOrgId', firstId);
                    setActiveOrgId(firstId);
                }
            } else if (list.length && activeOrgId && !list.some(o => String(o._id) === activeOrgId)) {
                // active org no longer in list (left/removed) → switch to first
                const firstId = String(list[0]._id);
                localStorage.setItem('activeOrgId', firstId);
                setActiveOrgId(firstId);
            }
        } catch {
            // silently ignore until auth ready
        } finally {
            setLoading(false);
        }
    }, [user, activeOrgId]);

    useEffect(() => { fetchOrgs(); }, [fetchOrgs]);

    const switchOrg = (orgId) => {
        const id = String(orgId);
        localStorage.setItem('activeOrgId', id);
        setActiveOrgId(id);
    };

    const createOrg = async (payload) => {
        const { data } = await api.post('/organizations', payload);
        const id = String(data._id);
        localStorage.setItem('activeOrgId', id);
        setActiveOrgId(id);
        await fetchOrgs();
        return data;
    };

    const activeOrg = orgs.find(o => String(o._id) === activeOrgId) || null;

    return (
        <OrgsContext.Provider value={{ orgs, activeOrg, activeOrgId, loading, switchOrg, createOrg, refresh: fetchOrgs }}>
            {children}
        </OrgsContext.Provider>
    );
}
