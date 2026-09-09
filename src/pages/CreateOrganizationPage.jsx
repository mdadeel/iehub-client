import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrgs } from '../context/OrgsContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import toast from 'react-hot-toast';

export default function CreateOrganizationPage() {
    const { createOrg } = useOrgs();
    const navigate = useNavigate();
    const [form, setForm] = useState({ legalName: '', type: 'Both', country: 'Global' });
    const [saving, setSaving] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.legalName.trim()) return toast.error('Legal name required');
        setSaving(true);
        try {
            await createOrg({ legalName: form.legalName.trim(), type: form.type, country: form.country });
            toast.success('Organization created');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to create organization');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold tracking-tight">Create organization</h1>
            <p className="text-sm text-foreground-secondary mt-1">Your organization is the tenant root for trading as a team. You can invite others after creation.</p>
            <Card className="mt-6">
                <CardContent className="p-6">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-medium">Legal name *</label>
                            <Input value={form.legalName} onChange={e => setForm(f => ({ ...f, legalName: e.target.value }))} placeholder="Thorne Logistics Ltd." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-medium">Type</label>
                                <select className="w-full h-9 rounded-md border border-border-default bg-surface px-3 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                    <option value="Buyer">Buyer</option>
                                    <option value="Supplier">Supplier</option>
                                    <option value="Both">Both</option>
                                    <option value="LogisticsPartner">Logistics</option>
                                    <option value="InspectionAgency">Inspection</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-medium">Country</label>
                                <Input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Global" />
                            </div>
                        </div>
                        <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create organization'}</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
