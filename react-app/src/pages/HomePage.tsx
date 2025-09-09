import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { TextList } from '@/components/TextList';
import { AddForm } from '@/components/AddForm';
import { TextExcerpt } from '@/types';
import { Plus } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExcerpt, setEditingExcerpt] = useState<TextExcerpt | null>(null);
  const [fontLoading, setFontLoading] = useState(true);

  // Simulate font loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFontLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddNew = () => {
    setEditingExcerpt(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (data: TextExcerpt) => {
    setEditingExcerpt(data);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // In a real app, this would call an API
    console.log('Delete excerpt with id:', id);
  };

  const handleSubmit = async (data: TextExcerpt) => {
    // In a real app, this would call an API
    console.log('Submit excerpt:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsDialogOpen(false);
    setEditingExcerpt(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingExcerpt(null);
  };

  if (fontLoading) {
    return (
      <div className="paper-bg h-screen w-full flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="paper-bg h-screen w-full relative">
      {/* Floating Add Button */}
      <div className="fixed top-10 left-10 z-50">
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-3 rounded-full bg-white p-3.5 text-blue-gray-900 shadow-xl hover:shadow-lg"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          新增
        </Button>
      </div>

      {/* Dialog for Add/Edit Form */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
          <AddForm
            chooseId={editingExcerpt?.id}
            initialData={editingExcerpt || undefined}
            onSubmit={handleSubmit}
            onClose={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Main Text List */}
      <TextList onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};