export const getInitials = (name) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
