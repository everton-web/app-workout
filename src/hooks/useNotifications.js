import { useState } from 'react';

export function useNotifications() {
  const [permissao, setPermissao] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );

  const pedir = async () => {
    if (typeof Notification === 'undefined') return 'denied';
    const p = await Notification.requestPermission();
    setPermissao(p);
    return p;
  };

  const enviar = (titulo, corpo) => {
    if (permissao === 'granted') {
      new Notification(titulo, { body: corpo });
    }
  };

  return { permissao, pedir, enviar };
}
