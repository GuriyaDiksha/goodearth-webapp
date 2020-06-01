import { useEffect, useRef } from "react";

export default function useOutsideDetection<T extends HTMLElement>(
  handleClick: (event: MouseEvent) => void
) {
  const ref = useRef<T>(null);

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (event.defaultPrevented) return;
    if (ref.current && !ref.current.contains(target)) handleClick(event);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });

  return { ref };
}
