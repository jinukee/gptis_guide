/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GuideType =
  | "TASK"
  | "TROUBLESHOOTING"
  | "FAQ"
  | "TERM"
  | "PERMISSION";

export type GuideStatus =
  | "DRAFT"
  | "REVIEW"
  | "PUBLISHED"
  | "HIDDEN";

export interface TextBlock {
  id: string;
  type: "TEXT";
  title?: string;
  body: string;
}

export interface StepBlock {
  id: string;
  type: "STEP";
  stepNumber: number;
  title: string;
  menuPath?: string;
  description: string;
  inputExample?: string;
  expectedResult?: string;
}

export interface WarningBlock {
  id: string;
  type: "WARNING";
  message: string;
}

export interface TipBlock {
  id: string;
  type: "TIP";
  message: string;
}

export interface ChecklistBlock {
  id: string;
  type: "CHECKLIST";
  title: string;
  items: string[];
}

export interface ErrorExampleBlock {
  id: string;
  type: "ERROR_EXAMPLE";
  errorMessage: string;
  possibleCauses: string[];
}

export interface ResultExampleBlock {
  id: string;
  type: "RESULT_EXAMPLE";
  description: string;
}

export interface ImagePlaceholderBlock {
  id: string;
  type: "IMAGE_PLACEHOLDER";
  caption: string;
  altText: string;
}

export type ContentBlock =
  | TextBlock
  | StepBlock
  | WarningBlock
  | TipBlock
  | ChecklistBlock
  | ErrorExampleBlock
  | ResultExampleBlock
  | ImagePlaceholderBlock;

export interface Guide {
  id: string;
  title: string;
  summary: string;
  categoryId: string;
  type: GuideType;
  status: GuideStatus;
  targetUsers: string[];
  difficulty: "EASY" | "MEDIUM" | "HARD";
  estimatedMinutes: number;
  tags: string[];
  synonyms: string[];
  errorMessages: string[];
  prerequisites: string[];
  contentBlocks: ContentBlock[];
  relatedGuideIds: string[];
  viewCount: number;
  helpfulCount: number;
  partiallyHelpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  updatedAt: string;
  author: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  displayOrder: number;
}

export interface GuideFeedback {
  id: string;
  guideId: string;
  result: "SOLVED" | "PARTIALLY_SOLVED" | "NOT_SOLVED";
  reasons: string[];
  comment?: string;
  createdAt: string;
}

export interface SearchLog {
  id: string;
  query: string;
  resultCount: number;
  selectedGuideId?: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  eventName: string;
  timestamp: string;
  metadata: Record<string, string | number | boolean>;
}
