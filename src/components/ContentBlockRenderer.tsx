/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Menu,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  CheckSquare,
  AlertOctagon,
  Image as ImageIcon,
  ArrowRight
} from "lucide-react";
import { ContentBlock } from "../types";

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
}

export const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = ({ blocks }) => {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        switch (block.type) {
          case "TEXT":
            return (
              <div key={block.id} className="prose prose-sm max-w-none text-gray-700">
                {block.title && <h3 className="text-sm font-bold text-gray-900 mb-2">{block.title}</h3>}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{block.body}</p>
              </div>
            );

          case "STEP":
            return (
              <div
                key={block.id}
                className="relative flex gap-4 p-5 rounded-xl border border-gray-100 bg-white shadow-xs hover:shadow-sm transition"
              >
                {/* Step Circle */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-sm shrink-0">
                  {block.stepNumber}
                </div>
                
                {/* Step Content */}
                <div className="flex-1 space-y-2.5">
                  <h4 className="text-sm font-bold text-gray-900 leading-tight">{block.title}</h4>
                  
                  {block.menuPath && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-50 border border-gray-100 text-[11px] text-gray-600 font-semibold">
                      <Menu className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-gray-400 font-normal">경로:</span>
                      <span>{block.menuPath}</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {block.description}
                  </p>

                  {/* Input and Expected Result side by side if present */}
                  {(block.inputExample || block.expectedResult) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {block.inputExample && (
                        <div className="p-3 rounded-lg bg-gray-50/50 border border-gray-100">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                            입력 예시
                          </span>
                          <code className="text-xs font-mono text-blue-700 font-semibold bg-blue-50/50 px-1.5 py-0.5 rounded">
                            {block.inputExample}
                          </code>
                        </div>
                      )}
                      {block.expectedResult && (
                        <div className="p-3 rounded-lg bg-green-50/20 border border-green-100/50">
                          <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider block mb-1">
                            예상 결과
                          </span>
                          <span className="text-xs text-gray-700 leading-relaxed">
                            {block.expectedResult}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );

          case "WARNING":
            return (
              <div key={block.id} className="rounded-xl bg-amber-50 border border-amber-200 p-4.5 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">주의사항</h4>
                  <p className="text-xs text-amber-700 mt-1 leading-relaxed whitespace-pre-line">{block.message}</p>
                </div>
              </div>
            );

          case "TIP":
            return (
              <div key={block.id} className="rounded-xl bg-blue-50/50 border border-blue-100 p-4.5 flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">유용한 팁</h4>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed whitespace-pre-line">{block.message}</p>
                </div>
              </div>
            );

          case "CHECKLIST":
            return (
              <div key={block.id} className="rounded-xl border border-gray-200 bg-white p-5 space-y-3.5 shadow-xs">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                  <CheckSquare className="h-4.5 w-4.5 text-blue-600" />
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{block.title}</h4>
                </div>
                <ul className="space-y-2.5">
                  {block.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                      <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );

          case "ERROR_EXAMPLE":
            return (
              <div key={block.id} className="rounded-xl border border-red-200 bg-red-50/10 overflow-hidden shadow-xs">
                {/* Code Terminal Header */}
                <div className="bg-red-950/90 text-white px-4 py-2.5 flex items-center gap-2 border-b border-red-900/50">
                  <AlertOctagon className="h-4 w-4 text-red-400" />
                  <span className="font-mono text-[10px] text-red-300 tracking-tight font-semibold">오류 메시지 실제 예시</span>
                </div>
                <div className="p-4 sm:p-5 space-y-3.5">
                  {/* Error code display */}
                  <div className="p-3 bg-red-950/5 rounded-lg border border-red-100/70">
                    <code className="text-xs font-mono text-red-600 font-bold block whitespace-pre-wrap">
                      {block.errorMessage}
                    </code>
                  </div>
                  
                  {block.possibleCauses && block.possibleCauses.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                        예상 유발 원인 및 결함 범위:
                      </span>
                      <ul className="space-y-1.5">
                        {block.possibleCauses.map((cause, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <ArrowRight className="h-3 w-3 text-red-400 shrink-0 mt-1" />
                            <span>{cause}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );

          case "RESULT_EXAMPLE":
            return (
              <div key={block.id} className="rounded-xl border border-green-200 bg-green-50/10 p-5 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">정상 결과 확인 예시</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                  {block.description}
                </p>
              </div>
            );

          case "IMAGE_PLACEHOLDER":
            return (
              <div key={block.id} className="space-y-1.5">
                <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center p-8 text-center text-gray-400 min-h-[140px]">
                  <ImageIcon className="h-8 w-8 text-gray-300 mb-2" />
                  <span className="text-xs text-gray-500 font-semibold">{block.caption}</span>
                  <span className="text-[10px] text-gray-400 mt-1">대체 텍스트: {block.altText}</span>
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
