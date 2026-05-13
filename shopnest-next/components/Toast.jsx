'use client';
import { useStore } from '@/context/StoreContext';

export default function Toast() {
  const { state } = useStore();
  return (
    <div id="toast" className={state.toast ? 'show' : ''}>
      {state.toast}
    </div>
  );
}
