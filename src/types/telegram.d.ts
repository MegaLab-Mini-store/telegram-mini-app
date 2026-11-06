interface Window {
  Telegram?: {
    WebApp?: {
      initData: string;
      CloudStorage?: {
        getItem: (key: string) => Promise<string | null>;
        setItem: (key: string, value: string) => Promise<boolean>;
        removeItem: (key: string) => Promise<boolean>;
      };
      initDataUnsafe?: {
        user?: {
          id: number;
          first_name: string;
          last_name?: string;
          username?: string;
          photo_url: string;
        };
      },
      ready: () => void;
      expand: () => void;
    };
  };
}