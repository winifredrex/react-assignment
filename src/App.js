import React, { useReducer, useCallback, useEffect } from 'react';
import './App.css';
import SelectField from './components/Select';
import { appReducer, initialState } from './reducers/appReducer';
import { fetchBookRecommendations, createBookPrompt } from './api/geminiApi';
import { FormAction, ApiAction } from './actions/actionTypes';

import listOfGenreOption from './store/genre.json';
import listOfMoodOption from './store/mood.json';

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const GEMINI_API_KEY = 'AIzaSyBxUXXmvfFlPXJsA5_cjT0594fFmglxVAc';

  useEffect(() => {
    if (state.genre) {
      dispatch({
        type: FormAction.UPDATE_AVAILABLE_MOODS,
        payload: listOfMoodOption[state.genre] || []
      });
    }
  }, [state.genre]);

  const fetchRecommendations = useCallback(async () => {
    if (!state.genre || !state.mood || !state.level) return;

    dispatch({ type: ApiAction.FETCH_START });

    try {
      const prompt = createBookPrompt(state.genre, state.mood, state.level);
      const data = await fetchBookRecommendations(prompt, GEMINI_API_KEY);
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error('No response from AI');

      dispatch({
        type: ApiAction.FETCH_SUCCESS,
        payload: { content: [{ text }] }
      });
    } catch (error) {
      dispatch({
        type: ApiAction.FETCH_ERROR,
        payload: error.message || 'Something went wrong'
      });
    }
  }, [state.genre, state.mood, state.level]);

  return (
    <div className="app-container">
      <div className="app-inner">
        <h1>📚 AI Book Recommender</h1>
        <p>Get personalized book recommendations using Gemini AI</p>

        <div className="selectors">
          <SelectField
            label="Genre"
            placeholder="Select a genre"
            id="genre"
            options={listOfGenreOption}
            value={state.genre}
            onSelect={(value) =>
              dispatch({ type: FormAction.SET_GENRE, payload: value })
            }
          />

          <SelectField
            label="Mood"
            placeholder="Select a mood"
            id="mood"
            options={state.availableMoods}
            value={state.mood}
            disabled={!state.genre}
            onSelect={(value) =>
              dispatch({ type: FormAction.SET_MOOD, payload: value })
            }
          />

          <SelectField
            label="Experience Level"
            placeholder="Select level"
            id="level"
            options={['Beginner', 'Intermediate', 'Expert']}
            value={state.level}
            onSelect={(value) =>
              dispatch({ type: FormAction.SET_LEVEL, payload: value })
            }
          />
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={state.loading || !state.genre || !state.mood || !state.level}
        >
          {state.loading ? 'Generating...' : '✨ Get AI Recommendations'}
        </button>

        {state.error && <div className="error">{state.error}</div>}

        {state.aiResponses.length > 0 && (
          <div className="recommendations">
            {state.aiResponses.map((response, index) => (
              <div key={index} className="recommendation-card">
                <div className="recommendation-header">
                  <div className="number">{index + 1}</div>
                  <h3>Gemini AI Recommendation</h3>
                </div>
                <p>{response.content[0].text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
