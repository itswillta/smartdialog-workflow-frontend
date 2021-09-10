/* eslint-disable consistent-return */

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import FilledInput from '../FilledInput/FilledInput';
import { useTranslation } from '../../../../../../i18n';

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
  },
  input: ({ isSmall }) => ({
    padding: isSmall ? theme.spacing(0.5) : theme.spacing(0.5, 3, 0.5, 1),
    textOverflow: 'ellipsis',
    fontSize: isSmall ? 12 : 14,
    maxHeight: isSmall ? 20 : 'unset',
    display: 'flex',
  }),
  dropdown: {
    position: 'fixed',
    width: ({ fixedWidth }) => fixedWidth,
    background: theme.palette.common.white,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(0.5, 0),
    maxHeight: 244,
    overflowY: 'auto',
    zIndex: 1,
  },
  hidden: {
    opacity: 0,
    pointerEvents: 'none',
    userSelect: 'none',
    '-webkit-tap-highlight-color': 'transparent',
  },
  dropdownItem: ({ isSmall }) => ({
    padding: isSmall ? theme.spacing(0.25, 0.5) : theme.spacing(0.5, 1),
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: isSmall ? 12 : 14,
    '&:hover': {
      background: theme.palette.grey[100],
    },
    wordBreak: 'break-all',
  }),
  dropdownItemSelected: {
    background: theme.palette.grey[100],
  },
  noMatchingOption: ({ isSmall }) => ({
    fontSize: isSmall ? 12 : 14,
    padding: isSmall ? theme.spacing(0.5, 1) : theme.spacing(1, 2),
    textAlign: 'left',
  }),
  dropdownIcon: ({ isSmall }) => ({
    position: 'absolute',
    right: isSmall ? theme.spacing(0.25) : theme.spacing(0.5),
    top: isSmall ? 0 : theme.spacing(0.25),
    color: theme.palette.action.active,
    pointerEvents: 'none',
    width: isSmall ? 20 : 24,
    height: isSmall ? 20 : 24,
  }),
}));

const DropdownItem = ({ dropdownItem, PopoverContentComponent }) => {
  const [shouldShowPopper, setShouldShowPopper] = useState(false);
  const [anchorElement, setAnchorElement] = useState(null);
  const DropdownItemComponent = dropdownItem.Component;

  if (!PopoverContentComponent) return <DropdownItemComponent />;

  const handleMouseEnter = () => {
    setShouldShowPopper(true);
  };

  const handleMouseLeave = () => {
    setShouldShowPopper(false);
  };

  return (
    <>
      <Popper
        style={{ zIndex: 100 }}
        id={dropdownItem.key}
        open={shouldShowPopper}
        anchorEl={anchorElement}
        placement="right-start"
      >
        <PopoverContentComponent id={dropdownItem.key} />
      </Popper>
      <DropdownItemComponent
        ref={setAnchorElement}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
    </>
  );
};

const Autocomplete = ({
  options,
  getOptionKey,
  getOptionLabel,
  value,
  onChange,
  placeholder = '',
  fixedWidth = 244,
  onSelectChildren,
  shouldShowFullOptions = false,
  PopoverContentComponent,
  shouldAllowFreeInput = false,
  isSmall = false,
  children,
}) => {
  const classes = useStyles({ fixedWidth, isSmall });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState('');
  const [shouldShowDropdown, setShouldShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const containerRef = useRef();
  const { t } = useTranslation('dialog');

  useEffect(
    () => {
      if (value === '') return setInputValue('');

      const selectedOption = options.find(
        option => String(getOptionKey(option)) === String(value),
      );

      if (!selectedOption) return;

      setInputValue(getOptionLabel(selectedOption));
    },
    [options, value, getOptionKey, getOptionLabel],
  );

  const handleInputChange = event => {
    setInputValue(event.target.value);

    if (event.target.value === '' || shouldAllowFreeInput) {
      if (typeof onChange === 'function') onChange(event.target.value);
    }
  };

  const handleMouseDown = event => {
    event.stopPropagation();
  };

  const handleMouseMove = event => {
    event.stopPropagation();
  };

  const filteredOptions = useMemo(
    () => {
      if (shouldShowFullOptions) return options;

      return options.filter(option => {
        const optionLabel = getOptionLabel(option);

        return optionLabel.includes(inputValue);
      });
    },
    [options, inputValue, shouldShowFullOptions],
  );

  useEffect(
    () => {
      const currentSelectedIndex = filteredOptions.findIndex(
        filteredOption => getOptionKey(filteredOption) === value,
      );

      if (currentSelectedIndex > -1) setSelectedIndex(currentSelectedIndex);
    },
    [filteredOptions, value],
  );

  const selectableLength = children
    ? filteredOptions.length + 1
    : filteredOptions.length;

  const closeDropdown = () => {
    setShouldShowDropdown(false);
    setSelectedIndex(-1);

    if (children && selectedIndex === selectableLength - 1) {
      if (onSelectChildren === 'function') onSelectChildren();
    }

    const selectedOption = filteredOptions[selectedIndex] || {};
    const selectedKey = getOptionKey(selectedOption);

    const finalOption = options.find(
      option =>
        getOptionKey(option) === value || getOptionKey(option) === selectedKey,
    );

    if (finalOption) {
      setInputValue(getOptionLabel(finalOption));

      if (getOptionKey(finalOption) !== value) {
        if (onChange === 'function') onChange(getOptionKey(finalOption));
      }
    } else if (!shouldAllowFreeInput) {
      setInputValue('');
    }
  };

  const handleSelectItem = useCallback(
    option => () => {
      if (option && typeof onChange === 'function')
        onChange(getOptionKey(option));

      closeDropdown();
    },
    [onChange, getOptionKey],
  );

  const dropdownItems = useMemo(
    () =>
      filteredOptions.map(option => {
        const key = getOptionKey(option);
        const optionLabel = getOptionLabel(option);
        const selectedOption = filteredOptions[selectedIndex] || {};
        const selectedKey = getOptionKey(selectedOption);

        return {
          key,
          Component: React.memo(
            React.forwardRef(({ onMouseEnter, onMouseLeave }, ref) => (
              <div
                key={key}
                ref={ref}
                className={clsx(
                  classes.dropdownItem,
                  selectedKey === key ? classes.dropdownItemSelected : '',
                )}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseDown={handleSelectItem(option)}
              >
                {optionLabel}
              </div>
            )),
          ),
        };
      }),
    [filteredOptions, getOptionKey, inputValue, getOptionLabel, selectedIndex],
  );

  const handleInputKeyDown = event => {
    if (!shouldShowDropdown) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      return setSelectedIndex(sI => {
        if (sI + 1 === selectableLength) return selectableLength - 1;

        return sI + 1;
      });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      return setSelectedIndex(sI => {
        if (sI === 0) return 0;

        return sI - 1;
      });
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      event.target.blur();

      handleSelectItem(filteredOptions[selectedIndex])();
    }
  };

  const handleInputFocus = () => {
    setShouldShowDropdown(true);
  };

  const handleClickAway = () => {
    if (shouldShowDropdown) closeDropdown();
  };

  useEffect(() => {
    const handleWheel = event => {
      if (
        (dropdownRef.current && dropdownRef.current.contains(event.target)) ||
        dropdownRef.current === event.target
      ) {
        event.stopPropagation();
      }
    };

    document.addEventListener('wheel', handleWheel, { capture: true });

    return () =>
      document.removeEventListener('wheel', handleWheel, { capture: true });
  }, []);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div
        ref={containerRef}
        className={classes.container}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      >
        <FilledInput
          className={classes.input}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleInputKeyDown}
          width={fixedWidth}
        />
        {!shouldAllowFreeInput && (
          <ArrowDropDownIcon className={classes.dropdownIcon} />
        )}
        <Popper
          open={shouldShowDropdown}
          anchorEl={containerRef.current}
          placement="bottom-start"
          style={{ zIndex: 10000 }}
        >
          <div
            ref={dropdownRef}
            className={clsx(
              classes.dropdown,
              !dropdownItems.length && shouldAllowFreeInput
                ? classes.hidden
                : '',
            )}
          >
            {dropdownItems.length > 0 ? (
              dropdownItems.map(dropdownItem => (
                <DropdownItem
                  key={dropdownItem.key}
                  dropdownItem={dropdownItem}
                  PopoverContentComponent={PopoverContentComponent}
                />
              ))
            ) : (
              <div className={classes.noMatchingOption}>
                {t('noMatchingOption')}
              </div>
            )}
            {!!children && (
              <div
                className={
                  selectedIndex === selectableLength - 1
                    ? classes.dropdownItemSelected
                    : ''
                }
              >
                {children}
              </div>
            )}
          </div>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default Autocomplete;
