import React, { useState } from 'react';
import { InspirationNote } from '../types';
import { Plus, Sparkles, Loader2, X, Upload, Edit2, Trash2, EyeOff } from 'lucide-react';
import { analyzeInspirationIdea } from '../services/geminiService';
import { storage } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface InspirationBoardProps {
  notes: InspirationNote[];
  setNotes: React.Dispatch<React.SetStateAction<InspirationNote[]>>;
}

const InspirationBoard: React.FC<InspirationBoardProps> = ({ notes, setNotes }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Editing State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string | undefined>(undefined);
  const [editUploading, setEditUploading] = useState(false);

  const startEditing = (note: InspirationNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
    setEditImageUrl(note.imageUrl);
    setEditImageFile(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
    setEditImageUrl(undefined);
    setEditImageFile(null);
  };

  const saveEditing = async () => {
    if (!editContent.trim()) return;
    setEditUploading(true);

    let finalImageUrl = editImageUrl;

    if (editImageFile) {
      try {
        const storageRef = ref(storage, `inspiration/${Date.now()}_${editImageFile.name}`);
        const snapshot = await uploadBytes(storageRef, editImageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload image.");
        setEditUploading(false);
        return;
      }
    }

    setNotes(current => current.map(n =>
      n.id === editingId
        ? { ...n, content: editContent, imageUrl: finalImageUrl }
        : n
    ));

    setEditUploading(false);
    cancelEditing();
  };

  const addNote = async () => {
    if (!newNoteContent.trim() && !selectedFile) return;

    setUploading(true);
    let imageUrl = `https://picsum.photos/400/300?random=${Math.random()}`;

    if (selectedFile) {
      try {
        const storageRef = ref(storage, `inspiration/${Date.now()}_${selectedFile.name}`);
        const snapshot = await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to upload image. Please try again.");
        setUploading(false);
        return;
      }
    }

    const note: InspirationNote = {
      id: Math.random().toString(36).substr(2, 9),
      content: newNoteContent,
      category: 'General',
      imageUrl: imageUrl
    };
    setNotes([note, ...notes]);
    setNewNoteContent('');
    setSelectedFile(null);
    setIsAdding(false);
    setUploading(false);
  };

  const handleAIAnalysis = async (id: string, content: string) => {
    setAnalyzingId(id);
    const suggestion = await analyzeInspirationIdea(content);
    setNotes(current => current.map(n => n.id === id ? { ...n, aiSuggestion: suggestion } : n));
    setAnalyzingId(null);
  };

  const hideAI = (id: string) => {
    setNotes(current => current.map(n => n.id === id ? { ...n, aiSuggestion: undefined } : n));
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
          <div className="mt-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-wedding-gold transition-colors w-fit">
              <Upload size={16} />
              <span>{selectedFile ? selectedFile.name : "Upload Photo"}</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => { setIsAdding(false); setSelectedFile(null); }} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
            <button onClick={addNote} disabled={uploading} className="px-4 py-2 bg-wedding-gold text-white rounded-lg flex items-center gap-2">
              {uploading && <Loader2 className="animate-spin" size={16} />}
              Save Note
            </button>
          </div>
        </div>
      )}

      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {notes.map(note => (
          <div key={note.id} className="break-inside-avoid bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow relative group">
            {editingId === note.id ? (
              // EDIT MODE
              <div className="p-4">
                 {/* Image Edit Section */}
                 <div className="mb-3 relative group/edit-img">
                    {editImageUrl ? (
                      <div className="relative h-40 w-full rounded-lg overflow-hidden border border-stone-200">
                        <img src={editImageUrl} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => { setEditImageUrl(undefined); setEditImageFile(null); }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                          title="Remove Image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="h-24 w-full bg-stone-50 border-2 border-dashed border-stone-200 rounded-lg flex flex-col items-center justify-center text-gray-400 gap-1">
                        <span className="text-xs">No Image</span>
                      </div>
                    )}

                    <label className="mt-2 flex items-center gap-2 text-xs text-wedding-gold font-bold cursor-pointer hover:underline w-fit">
                      <Upload size={14} />
                      {editImageUrl ? "Change Image" : "Upload Image"}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setEditImageFile(file);
                            // Create temporary preview URL
                            const reader = new FileReader();
                            reader.onload = (ev) => setEditImageUrl(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                 </div>

                 <textarea
                    className="w-full p-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-wedding-gold outline-none mb-3"
                    rows={3}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                  />

                  <div className="flex justify-end gap-2">
                    <button onClick={cancelEditing} className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                    <button
                      onClick={saveEditing}
                      disabled={editUploading}
                      className="px-3 py-1.5 bg-wedding-gold text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    >
                      {editUploading && <Loader2 className="animate-spin" size={12} />}
                      Save
                    </button>
                  </div>
              </div>
            ) : (
              // VIEW MODE
              <>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-1">
                    <button
                     onClick={() => startEditing(note)}
                     className="p-1.5 bg-white/80 backdrop-blur-sm text-gray-500 hover:text-wedding-gold transition-colors rounded-full shadow-sm"
                     title="Edit"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button
                     onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                     className="p-1.5 bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 transition-colors rounded-full shadow-sm"
                     title="Delete"
                    >
                        <X size={14} />
                    </button>
                </div>

                {note.imageUrl && (
                  <div className="h-48 overflow-hidden bg-gray-100 border-b border-stone-100">
                    <img src={note.imageUrl} alt="Inspiration" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-5">
                  <p className="font-serif text-lg text-gray-800 mb-4 pr-6 leading-snug">{note.content}</p>

                  {note.aiSuggestion ? (
                    <div className="bg-wedding-sand/30 p-3 rounded-lg text-sm text-gray-700 mt-4 border border-wedding-gold/20 relative group/ai">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-wedding-olive font-bold uppercase text-[10px] tracking-widest">
                          <Sparkles size={14} /> AI Insight
                        </div>
                        <button
                          onClick={() => hideAI(note.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover/ai:opacity-100"
                          title="Hide/Remove AI Suggestion"
                        >
                          <EyeOff size={14} />
                        </button>
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InspirationBoard;