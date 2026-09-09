import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function InviteAcceptPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const accept = async () => {
        setLoading(true);
        try {
            const { data } = await api.post(`/organizations/invites/${token}/accept`);
            if (data?.orgId) localStorage.setItem('activeOrgId', String(data.orgId));
            toast.success('Invite accepted — organization added');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to accept invite');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto py-16 px-4 text-center">
            <h1 className="text-xl font-bold">Accept invitation</h1>
            <p className="text-sm text-foreground-secondary mt-2">Token: <span className="font-mono text-xs break-all">{token}</span></p>
            <Button className="mt-6" onClick={accept} disabled={loading}>{loading ? 'Accepting…' : 'Accept invite'}</Button>
        </div>
    );
}
