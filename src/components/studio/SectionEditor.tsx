'use client';

import type { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { updateSectionProps } from '@/redux/slices/draftPageSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function FieldGroup({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <p className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </p>
  );
}

export function SectionEditor() {
  const dispatch = useAppDispatch();
  const page = useAppSelector((s) => s.draftPage.page);
  const selectedId = useAppSelector((s) => s.draftPage.selectedSectionId);

  const section = page?.sections.find((s) => s.id === selectedId);

  if (!section) {
    return (
      <p className="text-sm text-muted-foreground" role="status">
        Select a section to edit its properties.
      </p>
    );
  }

  const sectionId = section.id;

  function updateProp(key: string, value: string) {
    dispatch(updateSectionProps({ sectionId, props: { [key]: value } }));
  }

  if (section.type === 'hero') {
    return (
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Hero properties</legend>
        <FieldGroup id="hero-headline" label="Headline">
          <Input
            id="hero-headline"
            value={String(section.props.headline ?? '')}
            onChange={(e) => updateProp('headline', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id="hero-sub" label="Subheadline">
          <Input
            id="hero-sub"
            value={String(section.props.subheadline ?? '')}
            onChange={(e) => updateProp('subheadline', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id="hero-cta-label" label="CTA label">
          <Input
            id="hero-cta-label"
            value={String(section.props.ctaLabel ?? '')}
            onChange={(e) => updateProp('ctaLabel', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id="hero-cta-url" label="CTA URL">
          <Input
            id="hero-cta-url"
            type="url"
            value={String(section.props.ctaUrl ?? '')}
            onChange={(e) => updateProp('ctaUrl', e.target.value)}
          />
        </FieldGroup>
      </fieldset>
    );
  }

  if (section.type === 'cta') {
    return (
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">CTA properties</legend>
        <FieldGroup id="cta-label" label="Label">
          <Input
            id="cta-label"
            value={String(section.props.label ?? '')}
            onChange={(e) => updateProp('label', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id="cta-url" label="URL">
          <Input
            id="cta-url"
            type="url"
            value={String(section.props.url ?? '')}
            onChange={(e) => updateProp('url', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id="cta-desc" label="Description">
          <Input
            id="cta-desc"
            value={String(section.props.description ?? '')}
            onChange={(e) => updateProp('description', e.target.value)}
          />
        </FieldGroup>
      </fieldset>
    );
  }

  if (section.type === 'featureGrid') {
    const features = Array.isArray(section.props.features)
      ? (section.props.features as { title: string; description: string }[])
      : [];
    const first = features[0] ?? { title: '', description: '' };

    function patchFeatures(patch: Partial<{ title: string; description: string }>) {
      const next = [...features];
      if (next.length === 0) {
        next.push({ title: patch.title ?? '', description: patch.description ?? '' });
      } else {
        next[0] = {
          title: patch.title ?? next[0].title,
          description: patch.description ?? next[0].description,
        };
      }
      dispatch(updateSectionProps({ sectionId, props: { features: next } }));
    }

    return (
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Feature grid</legend>
        <FieldGroup id="fg-title" label="Section title">
          <Input
            id="fg-title"
            value={String(section.props.title ?? '')}
            onChange={(e) => updateProp('title', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id="fg-f1-title" label="First feature title">
          <Input
            id="fg-f1-title"
            value={first.title}
            onChange={(e) => patchFeatures({ title: e.target.value })}
          />
        </FieldGroup>
        <FieldGroup id="fg-f1-desc" label="First feature description">
          <Input
            id="fg-f1-desc"
            value={first.description}
            onChange={(e) => patchFeatures({ description: e.target.value })}
          />
        </FieldGroup>
      </fieldset>
    );
  }

  if (section.type === 'testimonial') {
    return (
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium">Testimonial</legend>
        <FieldGroup id="tm-quote" label="Quote">
          <Input
            id="tm-quote"
            value={String(section.props.quote ?? '')}
            onChange={(e) => updateProp('quote', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id="tm-author" label="Author">
          <Input
            id="tm-author"
            value={String(section.props.author ?? '')}
            onChange={(e) => updateProp('author', e.target.value)}
          />
        </FieldGroup>
        <FieldGroup id="tm-role" label="Role">
          <Input
            id="tm-role"
            value={String(section.props.role ?? '')}
            onChange={(e) => updateProp('role', e.target.value)}
          />
        </FieldGroup>
      </fieldset>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      Inline editing for <strong>{section.type}</strong> is limited in the MVP.
    </p>
  );
}
