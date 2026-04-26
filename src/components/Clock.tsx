import React, { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { format } from 'date-fns';

export function Clock() {
  const [time, setTime] = useState(new Date());
  const { timezone, language } = useAppContext();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time according to the selected language and timezone
  const formattedTime = new Intl.DateTimeFormat(language, {
    timeZone: timezone,
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(time);

  return (
    <div className="text-[10px] leading-tight font-mono text-slate-500 hidden md:block">
      {formattedTime}
    </div>
  );
}
