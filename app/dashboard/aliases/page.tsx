'use client';

import { useState, useEffect } from 'react';
import { Mail, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, Search, ExternalLink } from 'lucide-react';
import { getAliases, createAlias, toggleAliasStatus, deleteAlias } from '@/lib/db';
import { Alias } from '@/types/database';

export default function AliasesPage() {
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAliasAddress, setNewAliasAddress] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAliases();
  }, []);

  const fetchAliases = async () => {
    try {
      const data = await getAliases();
      setAliases(data);
    } catch (error) {
      console.error('Error fetching aliases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlias = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAliasAddress) return;

    setIsCreating(true);
    try {
      // Basic validation: ensure it has an @ and at least one character before it
      if (!newAliasAddress.includes('@')) {
        alert('Please enter a valid email address');
        return;
      }
      await createAlias(newAliasAddress);
      setNewAliasAddress('');
      fetchAliases();
    } catch (error) {
      console.error('Error creating alias:', error);
      alert('Failed to create alias. Make sure it is unique.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await toggleAliasStatus(id, !currentStatus);
      setAliases(aliases.map(a => a.id === id ? { ...a, is_active: !currentStatus } : a));
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDeleteAlias = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alias? All associated rules and logs will be lost.')) return;
    try {
      await deleteAlias(id);
      setAliases(aliases.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting alias:', error);
    }
  };

  const filteredAliases = aliases.filter(a => 
    a.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Aliases</h1>
          <p className="text-slate-500 font-medium">Manage your virtual email addresses.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Creation Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 sticky top-28">
            <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
              <Plus className="text-white w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">New Alias</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Create a new secure address for a specific service.</p>
            
            <form onSubmit={handleCreateAlias} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Alias Address</label>
                <input
                  type="text"
                  placeholder="e.g. shopping@yourdomain.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  value={newAliasAddress}
                  onChange={(e) => setNewAliasAddress(e.target.value)}
                  disabled={isCreating}
                />
              </div>
              <button
                type="submit"
                disabled={isCreating || !newAliasAddress}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Alias
              </button>
            </form>
          </div>
        </div>

        {/* List Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl w-64 group focus-within:border-indigo-300 transition-all">
                <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500" />
                <input 
                  type="text" 
                  placeholder="Filter aliases..." 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <span className="text-xs font-bold text-slate-400">{filteredAliases.length} Aliases</span>
            </div>

            <div className="divide-y divide-slate-50">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="font-medium">Loading your aliases...</p>
                </div>
              ) : filteredAliases.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-4 text-center">
                  <div className="bg-slate-50 p-4 rounded-full">
                    <Mail className="w-8 h-8 opacity-20" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">No aliases found</p>
                    <p className="text-sm font-medium">Create your first alias to start protecting your inbox.</p>
                  </div>
                </div>
              ) : (
                filteredAliases.map((alias) => (
                  <div key={alias.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${alias.is_active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-bold text-lg tracking-tight ${alias.is_active ? 'text-slate-900' : 'text-slate-400 line-through'}`}>
                            {alias.address}
                          </h4>
                          {!alias.is_active && (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">Inactive</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs font-medium flex items-center gap-1.5">
                          Created {new Date(alias.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleStatus(alias.id, alias.is_active)}
                        className={`p-2 rounded-xl transition-all ${alias.is_active ? 'text-indigo-600 hover:bg-indigo-100' : 'text-slate-400 hover:bg-slate-200'}`}
                        title={alias.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {alias.is_active ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                      </button>
                      <button
                        onClick={() => handleDeleteAlias(alias.id)}
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl flex items-start gap-4">
            <div className="bg-white p-2 rounded-xl text-indigo-600 shadow-sm">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <p className="text-indigo-900 font-bold text-sm mb-1">Mailgun Integration</p>
              <p className="text-indigo-700/70 text-xs font-medium leading-relaxed">
                Remember to configure your Mailgun domain to route emails to your inbound webhook URL. Use these aliases as your "To" addresses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
