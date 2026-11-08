import { navigate, withBase } from "./router";

const Link = ({ to, onClick, children, ...props }) => {
  const handleClick = (event) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigate(to);
  };

  return (
    <a href={withBase(to)} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export default Link;
