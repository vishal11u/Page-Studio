'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { reorderSections, selectSection, removeSection } from '@/redux/slices/draftPageSlice';
import { sectionRegistry } from '@/registry/sectionRegistry';
import { Button } from '@/components/ui/button';
import type { Section, SectionType } from '@/types/page';

function registryLabel(type: string): string {
  if (type in sectionRegistry) {
    return sectionRegistry[type as SectionType].label;
  }
  return `Unsupported (${type})`;
}

function SortableItem({ section }: { section: Section }) {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((s) => s.draftPage.selectedSectionId);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 rounded-md border p-2 ${
        selectedId === section.id ? 'border-primary bg-muted' : 'border-border'
      }`}
    >
      <button
        type="button"
        className="cursor-grab px-1 text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label={`Drag to reorder ${registryLabel(section.type)}`}
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>
      <button
        type="button"
        className="flex-1 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        onClick={() => dispatch(selectSection(section.id))}
      >
        {registryLabel(section.type)}
      </button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        aria-label={`Remove ${registryLabel(section.type)}`}
        onClick={() => dispatch(removeSection(section.id))}
      >
        Remove
      </Button>
    </li>
  );
}

export function SectionList() {
  const dispatch = useAppDispatch();
  const sections = useAppSelector((s) => s.draftPage.page?.sections ?? []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    const reordered = [...sections];
    const [moved] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, moved);
    dispatch(reorderSections(reordered.map((s) => s.id)));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <ul className="space-y-2" role="list" aria-label="Page sections">
          {sections.map((section) => (
            <SortableItem key={section.id} section={section} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
