import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  input: {
    border: 'none',
    background: '#f1f3f4',
    borderRadius: '4px 4px 0 0',
    padding: theme.spacing(0.5, 1, 0.5, 1),
    outline: 'none',
    fontSize: 14,
    width: ({ width }) => width,
  },
}));

const FilledInput = ({
  value,
  onChange,
  className = '',
  placeholder,
  width = 'auto',
  onMouseDown,
  onMouseMove,
  ...rest
}) => {
  const classes = useStyles({ width });

  const handleMouseDown = event => {
    event.stopPropagation();

    if (typeof onMouseDown === 'function') onMouseDown(event);
  };

  const handleMouseMove = event => {
    event.stopPropagation();

    if (typeof onMouseMove === 'function') onMouseMove(event);
  };

  return (
    <input
      className={clsx(classes.input, className)}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      {...rest}
    />
  );
};

export default FilledInput;
