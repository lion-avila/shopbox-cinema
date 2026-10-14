import React, { useState } from 'react';
import { ConcessionItem } from '../../types/cinema';
import { CinemaStorage } from '../../services/storage';
import { Popcorn, Plus, Trash2, Check, Edit2 } from 'lucide-react';

interface ConcessionsManagerProps {
  onRefreshData: () => void;
}

export const ConcessionsManager: React.FC<ConcessionsManagerProps> = ({ onRefreshData }) => {
  const [items, setItems] = useState<ConcessionItem[]>(CinemaStorage.getConcessions());
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState(150);
  const [category, setCategory] = useState<'popcorn' | 'drink' | 'combo' | 'snack'>('popcorn');
  const [imageUrl, setImageUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: ConcessionItem = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      description: desc.trim() || 'Auditorium snack',
      price,
      category,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=500&auto=format&fit=crop&q=60',
    };

    const updated = [...items, newItem];
    CinemaStorage.saveConcessions(updated);
    setItems(updated);
    onRefreshData();
    setName('');
    setDesc('');
    setImageUrl('');
    setSuccessMsg('Concession item added to menu.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Delete this item from concessions?')) {
      const updated = items.filter((c) => c.id !== id);
      CinemaStorage.saveConcessions(updated);
      setItems(updated);
      onRefreshData();
    }
  };

  const handleUpdatePrice = (item: ConcessionItem) => {
    const newPriceStr = prompt(`Enter new price (PHP) for ${item.name}:`, String(item.price));
    if (newPriceStr !== null && !isNaN(Number(newPriceStr)) && Number(newPriceStr) > 0) {
      const updated = items.map((c) => (c.id === item.id ? { ...c, price: Number(newPriceStr) } : c));
      CinemaStorage.saveConcessions(updated);
      setItems(updated);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl font-mono text-xs">
      {/* Add New Item Form */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-zinc-900 border border-white/10 text-[#C5A059] flex items-center justify-center">
            <Popcorn className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white uppercase tracking-wider text-sm">
              Concessions & Bar Menu Configuration
            </h3>
            <p className="text-zinc-400 text-[11px] font-light">
              Add or modify snacks, fountain drinks, and combo offers for online upsell.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">Item Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Truffle Butter Popcorn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            >
              <option value="popcorn">Popcorn</option>
              <option value="drink">Fountain Drink</option>
              <option value="combo">Combo Deal</option>
              <option value="snack">Theater Snack</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">Price (₱ PHP)</label>
            <input
              type="number"
              required
              min={10}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">Description</label>
            <input
              type="text"
              placeholder="Freshly tossed with real melted butter..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-zinc-400 uppercase text-[10px] block mb-1">Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-white/10 text-white focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="sm:col-span-3 pt-1">
            <button
              type="submit"
              className="px-6 py-2.5 bg-zinc-100 hover:bg-[#C5A059] text-black font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Concessions Menu</span>
            </button>
          </div>
        </form>

        {successMsg && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center space-x-2">
            <Check className="w-3.5 h-3.5" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Existing Menu Items */}
      <div className="p-6 bg-[#0c0c10] border border-white/[0.08] space-y-4">
        <h4 className="font-bold uppercase tracking-wider text-white text-sm border-b border-white/[0.06] pb-3">
          Active Concessions Catalog ({items.length})
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="p-3 bg-zinc-950 border border-white/[0.06] flex items-center justify-between gap-4">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-12 h-12 bg-zinc-900 border border-white/10 shrink-0 overflow-hidden">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-white block truncate">{item.name}</span>
                  <span className="text-zinc-400 text-[10px] block">{item.category}</span>
                  <span className="font-bold text-[#C5A059] block mt-0.5">₱{item.price}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleUpdatePrice(item)}
                  className="p-1.5 border border-white/10 text-zinc-300 hover:text-white hover:border-white transition-colors"
                  title="Change Price"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1.5 border border-rose-900/40 text-rose-400 hover:bg-rose-950 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
