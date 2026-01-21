import { useEffect, useState } from "react";

const useOnlineSatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  function markOnline() {
    setIsOnline(true);
  }

  function markOffline() {
    setIsOnline(false);
  }

  useEffect(() => {
    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);

    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
    };
  }, []);
  return isOnline;
};

export default useOnlineSatus;
