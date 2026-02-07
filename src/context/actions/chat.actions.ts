import { Dispatch, SetStateAction } from 'react';

import { storage } from '../../utils/storage';
import { IChatMessage } from '../../utils/storage.types';

interface IChatSetters {
  setChatHistoryState: Dispatch<SetStateAction<IChatMessage[]>>;
  setGuideSummaryState: (summary: string | null) => void;
}

export interface IChatActions {
  addChatMessage: (message: IChatMessage) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  setGuideSummary: (summary: string | null) => Promise<void>;
}

export function createChatActions(setters: IChatSetters): IChatActions {
  const addChatMessage = async (message: IChatMessage): Promise<void> => {
    let newHistory: IChatMessage[] = [];
    setters.setChatHistoryState((prev) => {
      newHistory = [...prev, message];
      return newHistory;
    });
    await storage.setChatHistory(newHistory);
  };

  const clearChatHistory = async (): Promise<void> => {
    setters.setChatHistoryState([]);
    await storage.setChatHistory([]);
  };

  const setGuideSummary = async (summary: string | null): Promise<void> => {
    setters.setGuideSummaryState(summary);
    await storage.setGuideSummary(summary);
  };

  return { addChatMessage, clearChatHistory, setGuideSummary };
}
