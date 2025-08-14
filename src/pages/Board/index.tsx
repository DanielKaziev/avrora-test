import React, { useState, useCallback, useMemo } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Container, Stack, Paper, Typography, Button } from "@mui/material";
import type { ICard } from "../../types/board";
import SortableCard from "./components/SortableCard";
import CardForm from "./components/CardForm";
import EditDialog from "./components/EditDialog";

export default function Board() {
  const [cards, setCards] = useState<ICard[]>([
    { id: "1", title: "Card 1", description: "Description 1", icon: "created" },
    {
      id: "2",
      title: "Card 2",
      description: "Description 2",
      icon: "inProgress",
    },
    { id: "3", title: "Card 3", description: "Description 3", icon: "done" },
  ]);
  const [newCard, setNewCard] = useState<Omit<ICard, "id">>({
    title: "",
    description: "",
    icon: "created",
  });
  const [editCard, setEditCard] = useState<ICard | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const items = useMemo(() => cards.map((card) => card.id), [cards]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleAddCard = useCallback(() => {
    if (!newCard.title.trim()) return;
    setCards((prev) => [...prev, { id: Date.now().toString(), ...newCard }]);
    setNewCard({ title: "", description: "", icon: "created" });
  }, [newCard]);

  const handleDeleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const handleEditChange = useCallback((field: keyof ICard, value: string) => {
    setEditCard((prev) => (prev ? { ...prev, [field]: value } : prev));
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editCard) return;
    setCards((prev) => prev.map((c) => (c.id === editCard.id ? editCard : c)));
    setEditCard(null);
  }, [editCard]);

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(cards)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cards.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [cards]);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) setCards(json);
      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsText(file);
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Paper sx={{ p: 3 }} elevation={4}>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          mb={3}
        >
          <Typography variant="h5">Доска</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleExport}>
              Экспорт
            </Button>
            <Button variant="outlined" component="label">
              Импорт
              <input
                type="file"
                accept="application/json"
                hidden
                onChange={handleImport}
              />
            </Button>
          </Stack>
        </Stack>

        <Stack justifyContent="space-between" spacing={5} direction="row">
          <Stack flexGrow={1}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                <Stack spacing={2}>
                  {cards.map((card) => (
                    <SortableCard
                      key={card.id}
                      {...card}
                      onEdit={setEditCard}
                      onDelete={handleDeleteCard}
                    />
                  ))}
                </Stack>
              </SortableContext>
            </DndContext>
          </Stack>

          <Stack flexGrow={1}>
            <CardForm
              newCard={newCard}
              onChange={(field, value) =>
                setNewCard((prev) => ({ ...prev, [field]: value }))
              }
              onAdd={handleAddCard}
            />
          </Stack>
        </Stack>
      </Paper>

      <EditDialog
        editCard={editCard}
        onClose={() => setEditCard(null)}
        onChange={handleEditChange}
        onSave={handleSaveEdit}
      />
    </Container>
  );
}
