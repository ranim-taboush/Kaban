import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Box, Paper, Typography, Chip, Pagination, CircularProgress, } from '@mui/material';
import { Task, Column } from '../../types/kanbanTypes';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  column: { id: Column; title: string; color: string };
  tasks: Task[];
  totalTasks: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

export function KanbanColumn({
  column,
  tasks,
  totalTasks,
  currentPage,
  totalPages,
  onPageChange,
  isLoading
}: KanbanColumnProps) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        bgcolor: column.color,
        borderRadius: 3,
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Column Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
          {column.title}
        </Typography>
        <Chip
          label={totalTasks}
          size="small"
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.1)',
            fontWeight: 600
          }}
        />
      </Box>

      {/* Droppable Area */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              flex: 1,
              minHeight: 200,
              bgcolor: snapshot.isDraggingOver ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
              borderRadius: 2,
              transition: 'background-color 0.2s ease',
              p: 1
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={24} />
              </Box>
            ) : tasks.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                  />
                ))}
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: 150,
                color: 'text.secondary'
              }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  No tasks here
                </Typography>
              </Box>
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            size="small"
            sx={{
              '& .MuiPaginationItem-root': {
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }
            }}
          />
        </Box>
      )}
    </Paper>
  );
}