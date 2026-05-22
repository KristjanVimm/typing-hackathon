import { useState } from 'react';

export function useTypingTest() {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);

  return { input, setInput, startTime, setStartTime };
}
