import { createElement, useId } from 'react';
import data from '../data/technique-illustrations.json';
import type { Exercise } from '../lib/schema';
import { useI18n } from '../i18n';

type SvgNode = {
  tag: string;
  attrs: Record<string, string>;
  children: SvgNode[];
  textKey?: string;
};
type Drawing = { viewBox: string; nodes: SvgNode[] };
const drawings = data as unknown as Record<string, Drawing>;
const tags = new Set(['circle', 'defs', 'g', 'line', 'marker', 'path', 'polyline', 'rect', 'text']);

export default function TechniqueIllustration({ exercise }: { exercise: Exercise }) {
  const { t, local } = useI18n(),
    prefix = useId().replaceAll(':', '');
  const drawing = drawings[exercise.id];
  if (!drawing) return null;
  const render = (node: SvgNode, key: string): ReturnType<typeof createElement> | null => {
    if (!tags.has(node.tag)) return null;
    const attrs: Record<string, string> = {};
    for (const [name, raw] of Object.entries(node.attrs)) {
      if (name.startsWith('on') || ['style', 'href'].includes(name)) continue;
      let value = name === 'id' ? prefix + '-' + raw : raw;
      if (value.startsWith('url(')) {
        if (!/^url\(#[\w-]+\)$/.test(value)) continue;
        value = value.replace('url(#', 'url(#' + prefix + '-');
      }
      attrs[name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase())] = value;
    }
    return createElement(
      node.tag,
      { ...attrs, key },
      node.textKey ? t(node.textKey) : undefined,
      ...node.children.map((child, index) => render(child, key + '-' + index)),
    );
  };
  return (
    <figure className="technique-illustration">
      <svg viewBox={drawing.viewBox} role="img" aria-label={local(exercise.name)}>
        {drawing.nodes.map((node, index) => render(node, String(index)))}
      </svg>
      <figcaption>{t('techniqueDiagram')}</figcaption>
    </figure>
  );
}
