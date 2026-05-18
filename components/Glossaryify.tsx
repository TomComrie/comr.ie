import React from "react";
import GlossaryTooltip from "@/components/GlossaryTooltip";
import { CodeBlock, T } from "@/components/ContentComponents";
import { glossaryMatches } from "@/lib/glossary";

const SKIP_TAGS = new Set(["code", "pre", "a", "script", "style"]);

function isBoundary(char: string | undefined) {
  return !char || !/[A-Za-z0-9]/.test(char);
}

function findNextMatch(text: string, startIndex: number) {
  for (let i = startIndex; i < text.length; i += 1) {
    for (const match of glossaryMatches) {
      const candidate = text.slice(i, i + match.alias.length);
      if (candidate.toLowerCase() !== match.key) continue;

      const before = text[i - 1];
      const after = text[i + match.alias.length];
      if (!isBoundary(before) || !isBoundary(after)) continue;

      return {
        index: i,
        end: i + match.alias.length,
        match,
        text: candidate,
      };
    }
  }

  return null;
}

function glossaryifyText(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let seq = 0;

  while (cursor < text.length) {
    const next = findNextMatch(text, cursor);
    if (!next) {
      nodes.push(text.slice(cursor));
      break;
    }

    if (next.index > cursor) {
      nodes.push(text.slice(cursor, next.index));
    }

    nodes.push(
      <GlossaryTooltip
        key={`${keyPrefix}-${seq}`}
        term={next.text}
        canonical={next.match.canonical}
        definition={next.match.definition}
      />,
    );

    cursor = next.end;
    seq += 1;
  }

  return nodes;
}

function glossaryifyNode(node: React.ReactNode, keyPrefix: string): React.ReactNode {
  if (typeof node === "string") {
    return glossaryifyText(node, keyPrefix);
  }

  if (Array.isArray(node)) {
    return node.map((child, index) => glossaryifyNode(child, `${keyPrefix}-${index}`));
  }

  if (!React.isValidElement(node)) {
    return node;
  }

  if (typeof node.type === "string" && SKIP_TAGS.has(node.type)) {
    return node;
  }

  if (node.type === CodeBlock || node.type === T) {
    return node;
  }

  const children = node.props.children;
  if (children === undefined) {
    return node;
  }

  return React.cloneElement(node, {
    ...node.props,
    children: React.Children.map(children, (child, index) => glossaryifyNode(child, `${keyPrefix}-${index}`)),
  });
}

export default function Glossaryify({ children }: { children: React.ReactNode }) {
  return <>{glossaryifyNode(children, "g")}</>;
}
