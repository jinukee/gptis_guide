/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Search, X, CornerDownLeft } from "lucide-react";
import { Guide } from "../types";
import { guideRepository } from "../lib/repository";

interface SearchBarProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  id?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  initialValue = "",
  onSearch,
  id = "global-search-bar"
}) => {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Guide[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  // Handle autocomplete search
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      // Query without filters to get suggestions
      const results = await guideRepository.search(query);
      setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
    };

    const timeout = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(timeout);
  }, [query]);

  // Click outside listener to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  const handleSuggestionClick = (g: Guide) => {
    setQuery(g.title);
    setShowSuggestions(false);
    onSearch(g.title);
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    onSearch(term);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    onSearch("");
  };

  const recommendationChips = [
    { label: "LOT로 차량 찾기", query: "특정 부품 LOT가 장착된 차량 찾기" },
    { label: "차량으로 LOT 찾기", query: "차량에 장착된 부품 LOT 확인하기" },
    { label: "조회 결과 없음", query: "LOT 조회 결과가 없을 때 확인할 항목" },
    { label: "권한 오류", query: "접근 권한이 없다는 메시지가 표시될 때" },
    { label: "협력사 코드 검색", query: "협력사 코드가 검색되지 않을 때" },
    { label: "데이터 반영 지연", query: "신규 생산 데이터가 조회되지 않을 때" }
  ];

  return (
    <div id={id} className="w-full max-w-3xl mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="예: 특정 LOT가 적용된 차량을 찾고 싶어요"
            className="w-full pl-11 pr-24 py-3.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-950 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition"
          />
          <div className="absolute right-3 flex items-center gap-1.5">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                title="지우기"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition shadow-xs"
            >
              검색
              <CornerDownLeft className="h-3 w-3 hidden sm:inline" />
            </button>
          </div>
        </div>

        {/* Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-30 overflow-hidden divide-y divide-gray-100">
            {suggestions.map((g) => (
              <div
                key={g.id}
                onClick={() => handleSuggestionClick(g)}
                className="px-4 py-3 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between transition"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-gray-900">{g.title}</span>
                  <span className="text-[10px] text-gray-500 line-clamp-1">{g.summary}</span>
                </div>
                <span className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium shrink-0 ml-4">
                  {g.type === "TASK" ? "업무" : g.type === "TROUBLESHOOTING" ? "해결" : "가이드"}
                </span>
              </div>
            ))}
          </div>
        )}
      </form>

      {/* Recommended Search Term Chips */}
      <div className="mt-3.5 flex flex-wrap gap-1.5 items-center justify-center sm:justify-start">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">추천 검색어:</span>
        {recommendationChips.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChipClick(chip.query)}
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 text-xs font-medium text-gray-700 hover:text-blue-700 hover:border-blue-200 transition shadow-xs cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
