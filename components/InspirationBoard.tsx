import React, { useState } from 'react';
import { InspirationNote } from '../types';
import { Plus, Sparkles, Loader2, X } from 'lucide-react';
import { analyzeInspirationIdea } from '../services/geminiService';

interface InspirationBoardProps {
  notes: InspirationNote[];
  setNotes: React.Dispatch<React.SetStateAction<InspirationNote[]>>;
}

const InspirationBoard: React.FC<InspirationBoardProps> = ({ notes, setNotes }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const addNote = () => {
    if (!newNoteContent.trim()) return;
    const note: InspirationNote = {
      id: Math.random().toString(36).substr(2, 9),
      content: newNoteContent,
      category: 'General',
      imageUrl: `https://picsum.photos/400/300?random=${Math.random()}`
    };
    setNotes([note, ...notes]);
    setNewNoteContent('');
    setIsAdding(false);
  };

  const handleAIAnalysis = async (id: string, content: string) => {
    setAnalyzingId(id);
    const suggestion = await analyzeInspirationIdea(content);
    setNotes(current => current.map(n => n.id === id ? { ...n, aiSuggestion: suggestion } : n));
    setAnalyzingId(null);
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif text-wedding-charcoal">Vision Board</h2>
          <p className="text-gray-500">Collect ideas and let AI refine them.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-wedding-charcoal text-white px-6 py-2 rounded-full hover:bg-black transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> Add Idea
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-xl shadow-md border border-stone-200 animate-fade-in mb-6">
          <textarea
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-wedding-gold outline-none resize-none"
            rows={3}
            placeholder="Describe your idea (e.g., 'Sunset cocktail hour with live jazz on the pier')"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
            <button onClick={addNote} className="px-4 py-2 bg-wedding-gold text-white rounded-lg">Save Note</button>
          </div>
        </div>
      )}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {notes.map(note => (
          <div key={note.id} className="break-inside-avoid bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow relative group">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button 
                 onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                 className="p-1 text-gray-300 hover:text-red-500 transition-colors bg-white/50 rounded-full"
                >
                    <X size={16} />
                </button>
            </div>
            
            <div className="p-5">
              <p className="font-serif text-lg text-gray-800 mb-4 pr-6 leading-snug">{note.content}</p>
              
              {note.aiSuggestion ? (
                <div className="bg-wedding-sand/30 p-3 rounded-lg text-sm text-gray-700 mt-4 border border-wedding-gold/20">
                  <div className="flex items-center gap-2 text-wedding-olive font-bold mb-1 uppercase text-[10px] tracking-widest">
                    <Sparkles size={14} /> AI Insight
                  </div>
                  <div className="whitespace-pre-line leading-relaxed text-xs">{note.aiSuggestion}</div>
                </div>
              ) : (
                <button
                  onClick={() => handleAIAnalysis(note.id, note.content)}
                  disabled={analyzingId === note.id}
                  className="w-full py-2 border border-wedding-gold/50 text-wedding-gold rounded-lg hover:bg-wedding-sand/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                >
                  {analyzingId === note.id ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  Enhance with AI
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspirationBoard;