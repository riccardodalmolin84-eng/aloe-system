import React, { useState } from 'react';
import { useApp } from '../store';
import { RawMaterial } from '../types';
import { Package, Plus, Trash2, Edit2, Coins } from 'lucide-react';

const RawMaterials: React.FC = () => {
  const { rawMaterials, addRawMaterial, updateRawMaterial, deleteRawMaterial } = useApp();

  const [editingRM, setEditingRM] = useState<RawMaterial | null>(null);
  const [rmFormData, setRMFormData] = useState<Partial<RawMaterial>>({
    name: '', unit: 'gr', totalQuantity: 0, totalPrice: 0
  });

  const handleOpenEditRM = (rm: RawMaterial) => {
    setEditingRM(rm);
    setRMFormData({
      name: rm.name,
      unit: rm.unit,
      totalQuantity: rm.totalQuantity,
      totalPrice: rm.totalPrice
    });
  };

  const handleSaveRM = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rmFormData.name || (rmFormData.totalQuantity || 0) <= 0) return;

    try {
      if (editingRM) {
        await updateRawMaterial({
          ...editingRM,
          name: rmFormData.name!,
          unit: rmFormData.unit!,
          totalQuantity: rmFormData.totalQuantity!,
          totalPrice: rmFormData.totalPrice || 0
        });
        setEditingRM(null);
      } else {
        await addRawMaterial(rmFormData as Omit<RawMaterial, 'id' | 'workspaceId'>);
      }
      setRMFormData({ name: '', unit: 'gr', totalQuantity: 0, totalPrice: 0 });
    } catch (err: any) {
      alert(`Errore materia prima: ${err.message}`);
    }
  };

  const handleDeleteRM = async (id: string) => {
    if (confirm('Eliminare questa materia prima?')) {
      await deleteRawMaterial(id);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Cambusa / Materie Prime</h2>
          <p className="text-slate-500 font-medium">Gestisci le materie prime disponibili nel magazzino e i loro costi unitari.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Create / Edit Form */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-black flex items-center gap-3 text-slate-700 uppercase tracking-widest text-xs">
            {editingRM ? 'Modifica Materia Prima' : 'Registra Nuova Materia Prima'}
          </h3>
          <form onSubmit={handleSaveRM} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Nome Ingrediente</label>
              <input
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-700 outline-none focus:ring-4 focus:ring-rose-500/10 transition-all"
                placeholder="e.g. Miele di Acacia Bio"
                value={rmFormData.name || ''}
                onChange={e => setRMFormData({ ...rmFormData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Prezzo Totale (€)</label>
              <input
                type="number" step="0.01"
                className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-700 outline-none focus:ring-4 focus:ring-rose-500/10 transition-all"
                placeholder="0.00"
                value={rmFormData.totalPrice || ''}
                onChange={e => setRMFormData({ ...rmFormData, totalPrice: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Dimensione Confezione</label>
              <div className="flex gap-2">
                <input
                  type="number" step="0.01"
                  className="flex-1 p-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-slate-700 outline-none focus:ring-4 focus:ring-rose-500/10 transition-all"
                  placeholder="1000"
                  value={rmFormData.totalQuantity || ''}
                  onChange={e => setRMFormData({ ...rmFormData, totalQuantity: parseFloat(e.target.value) || 0 })}
                  required
                />
                <select className="p-4 bg-white border border-slate-100 rounded-2xl font-black text-slate-700 uppercase text-[10px] w-28" value={rmFormData.unit || 'gr'} onChange={e => setRMFormData({ ...rmFormData, unit: e.target.value })}>
                  <option value="gr">gr</option>
                  <option value="Kg">Kg</option>
                  <option value="ml">ml</option>
                  <option value="lit">lit</option>
                  <option value="Unità">Unità</option>
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-full p-4 bg-rose-100/30 border border-rose-100 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest">Costo Unitario</p>
                  <p className="text-xl font-black text-rose-800">
                    €{(rmFormData.totalPrice && rmFormData.totalQuantity ? rmFormData.totalPrice / rmFormData.totalQuantity : 0).toFixed(4)}
                    <span className="text-[10px] ml-1 font-bold">/ {rmFormData.unit || 'gr'}</span>
                  </p>
                </div>
                <Coins className="text-rose-300" size={24} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className={`flex-1 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${editingRM ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-100'} disabled:opacity-50`}
                disabled={!rmFormData.name || (rmFormData.totalQuantity || 0) <= 0}
              >
                {editingRM ? 'Applica Modifiche' : 'Registra'}
              </button>
              {editingRM && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingRM(null);
                    setRMFormData({ name: '', unit: 'gr', totalQuantity: 0, totalPrice: 0 });
                  }}
                  className="px-6 py-4 bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest rounded-2xl"
                >
                  Annulla
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: List / Grid */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-black flex items-center gap-3 text-slate-700 uppercase tracking-widest text-xs">
            <Package size={20} className="text-rose-500" /> Stock Materie Prime
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rawMaterials.map(rm => (
              <div key={rm.id} className={`p-5 border rounded-[2rem] shadow-sm flex items-center justify-between group transition-all ${editingRM?.id === rm.id ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-100 hover:border-rose-200'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner transition-all ${editingRM?.id === rm.id ? 'bg-amber-600 text-white' : 'bg-rose-50 text-rose-500 group-hover:bg-rose-600 group-hover:text-white'}`}>
                    <Package size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-black text-slate-800 text-xs uppercase tracking-tight truncate">{rm.name}</h5>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {rm.totalQuantity} {rm.unit} • €{rm.totalPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenEditRM(rm)} className={`p-2 rounded-xl transition-colors ${editingRM?.id === rm.id ? 'text-amber-600' : 'text-slate-200 hover:text-blue-500'}`}><Edit2 size={16} /></button>
                  <button onClick={() => handleDeleteRM(rm.id)} className="text-slate-200 hover:text-red-500 p-2 transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {rawMaterials.length === 0 && (
              <div className="col-span-full py-16 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[2.5rem]">
                <Package className="mx-auto text-slate-200 mb-3 opacity-20" size={48} />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nessuna materia prima in magazzino</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RawMaterials;
