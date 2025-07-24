import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, Typography, IconButton, Box, TextField, Button, Fade, CircularProgress } from '@mui/material';
import { Edit, Delete, Save, Cancel, DragIndicator } from '@mui/icons-material';
import { Task, TaskUpdates } from '../../types/kanbanTypes';
import { useUpdateTask, useDeleteTask } from '../../hooks/useTasks';

interface TaskCardProps {
  task: Task;
  index: number;
}

export function TaskCard({ task, index }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [showActions, setShowActions] = useState(false);

  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleSave = async () => {
    if (!title.trim()) return;

    const updates: TaskUpdates = {
      title: title.trim(),
      description: description.trim()
    };

    try {
      await updateTaskMutation.mutateAsync({ id: task.id, updates });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteTaskMutation.mutateAsync(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const isLoading = updateTaskMutation.isPending || deleteTaskMutation.isPending;

  return (
    <Draggable draggableId={task.id.toString()} index={index} isDragDisabled={isEditing}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            bgcolor: 'background.paper',
            transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
            boxShadow: snapshot.isDragging ? 4 : 1,
            cursor: isEditing ? 'default' : 'grab',
            '&:active': {
              cursor: isEditing ? 'default' : 'grabbing',
            },
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              boxShadow: 2,
            }
          }}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            {isEditing ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  size="small"
                  disabled={isLoading}
                  error={!title.trim()}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Task description"
                  size="small"
                  disabled={isLoading}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={isLoading ? <CircularProgress size={16} /> : <Save />}
                    onClick={handleSave}
                    disabled={isLoading || !title.trim()}
                    sx={{ flex: 1 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    disabled={isLoading}
                    sx={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle2" component="h3" sx={{ fontWeight: 600 }}>
                    {task.title}
                  </Typography>
                  <Fade in={showActions || snapshot.isDragging}>
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                      <Box {...provided.dragHandleProps}>
                        <IconButton size="small" sx={{ cursor: 'grab' }}>
                          <DragIndicator fontSize="small" />
                        </IconButton>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => setIsEditing(true)}
                        disabled={isLoading}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={handleDelete}
                        disabled={isLoading}
                        color="error"
                      >
                        {isLoading ? <CircularProgress size={16} /> : <Delete fontSize="small" />}
                      </IconButton>
                    </Box>
                  </Fade>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {task.description}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}