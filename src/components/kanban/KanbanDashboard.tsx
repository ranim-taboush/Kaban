'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Alert, InputAdornment, Container } from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { useTaskStore } from '../../store/useTaskStore';
import { useTasks, useMoveTask } from '../../hooks/useTasks';
import { Column, Task } from '../../types/kanbanTypes';
import { AddTaskModal } from './AddTaskModal';
import { KanbanColumn } from './KanbanColumn';

const COLUMNS: { id: Column; title: string; color: string }[] = [
  { id: 'backlog',     title: 'Backlog',     color: '#fee2e2' },
  { id: 'in-progress', title: 'In Progress', color: '#dbeafe' },
  { id: 'review',      title: 'Review',      color: '#fef3c7' },
  { id: 'done',        title: 'Done',        color: '#dcfce7' }
];

const ITEMS_PER_PAGE = 3;

export function KanbanDashboard() {
  // Zustand store
  const {
    searchTerm,
    currentPage,
    setSearchTerm,
    setCurrentPage
  } = useTaskStore();

  // React Query hooks
  const {
    data,
    isLoading,
    error,
    refetch
  } = useTasks();
  const tasks = (data ?? []) as Task[];

  const moveTaskMutation = useMoveTask();

  // Modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Fetch on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Filter + sort
  const filteredTasks = tasks.filter((t: { title: string; description: string; }) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getColumnTasks = (columnId: Column): Task[] =>
    filteredTasks
      .filter((t: { column: string; }) => t.column === columnId)
      .sort((a: { order: number; }, b: { order: number; }) => a.order - b.order);

  const getPaginatedTasks = (columnId: Column) => {
    const all = getColumnTasks(columnId);
    const page = currentPage[columnId];
    const totalPages = Math.ceil(all.length / ITEMS_PER_PAGE);
    const start = (page - 1) * ITEMS_PER_PAGE;
    return {
      tasks: all.slice(start, start + ITEMS_PER_PAGE),
      totalPages,
      currentPage: page,
      totalTasks: all.length
    };
  };

  // Drag & drop handler
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const params = {
      taskId:     parseInt(draggableId, 10),
      newColumn:  destination.droppableId as Column,
      newOrder:   destination.index
    };

    try {
      await moveTaskMutation.mutateAsync(params);
    } catch (err) {
      console.error('Failed to move task:', err);
    }
  };

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading tasks: {(error as Error).message}
        </Alert>
        <Button variant="contained" onClick={() => refetch()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                Kanban Dashboard
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Drag & drop to move tasks between columns
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                size="small"
                sx={{
                  minWidth: 250,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                startIcon={
                  isLoading ? <CircularProgress size={20} /> : <Add />
                }
                onClick={() => setShowAddModal(true)}
                disabled={isLoading}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' }
                }}
              >
                Add Task
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            component="section"
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                lg: 'repeat(4, 1fr)'
              },
              gap: 3
            }}
          >
            {COLUMNS.map(col => {
              const {
                tasks: columnTasks,
                totalPages,
                currentPage: page,
                totalTasks
              } = getPaginatedTasks(col.id);

              return (
                <KanbanColumn
                  key={col.id}
                  column={col}
                  tasks={columnTasks}
                  totalTasks={totalTasks}
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(newPage: number) =>
                    setCurrentPage(col.id, newPage)
                  }
                  isLoading={isLoading}
                />
              );
            })}
          </Box>
        </DragDropContext>

        {/* Add Task Modal */}
        {showAddModal && (
          <AddTaskModal
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
          />
        )}
      </Container>
    </Box>
  );
}
