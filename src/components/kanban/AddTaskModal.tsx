import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { Add, Cancel } from '@mui/icons-material';
import { useCreateTask } from '../../hooks/useTasks';
import { NewTaskInput } from '../../types/kanbanTypes';

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddTaskModal({ open, onClose }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const createTaskMutation = useCreateTask();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const taskData: NewTaskInput = {
      title: title.trim(),
      description: description.trim()
    };

    try {
      await createTaskMutation.mutateAsync(taskData);
      setTitle('');
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  const isLoading = createTaskMutation.isPending;

  return (
    <Dialog 
      open={open} 
      onClose={handleCancel} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ pb: 2 }}>
          Add New Task
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              fullWidth
              label="Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              error={!title.trim() && title.length > 0}
              helperText={!title.trim() && title.length > 0 ? 'Title is required' : ''}
            />
            
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              disabled={isLoading}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleCancel}
            disabled={isLoading}
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !title.trim()}
            startIcon={isLoading ? <CircularProgress size={20} /> : <Add />}
          >
            Add Task
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}