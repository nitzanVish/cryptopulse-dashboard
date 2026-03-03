/**
 * Sentiment Slice
 *
 * Global throttle for on-demand analysis — prevents repeated analyze requests
 * within GLOBAL_ANALYSIS_THROTTLE_MS after a trigger.
 */

import { createSlice } from '@reduxjs/toolkit';
import {
  SENTIMENT_SLICE_NAME,
  SENTIMENT_INITIAL_LAST_TRIGGER,
} from '@/constants/sentiment';

export interface SentimentState {
  /** Timestamp of last triggerAnalysis call — used for throttle */
  lastGlobalAnalysisTrigger: number;
}

const initialState: SentimentState = {
  lastGlobalAnalysisTrigger: SENTIMENT_INITIAL_LAST_TRIGGER,
};

const sentimentSlice = createSlice({
  name: SENTIMENT_SLICE_NAME,
  initialState,
  reducers: {
    setLastAnalysisTrigger: (state) => {
      state.lastGlobalAnalysisTrigger = Date.now();
    },
  },
});

export const { setLastAnalysisTrigger } = sentimentSlice.actions;
export default sentimentSlice.reducer;
