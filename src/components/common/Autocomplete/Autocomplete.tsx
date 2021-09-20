import { useI18n } from '@amoutonbrady/solid-i18n';
import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSX,
  mergeProps,
  onCleanup,
  onMount,
  Show,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';

import ArrowDropDownIcon from '../../icons/ArrowDropDownIcon';
import ClickAwayListener from '../ClickAwayListener/ClickAwayListener';
import FilledInput from '../FilledInput/FilledInput';
import Popover from '../Popover/Popover';
import './Autocomplete.scss';

interface AutocompleteProps<T = any> {
  options: ReadonlyArray<T>;
  getOptionKey: (option: T) => string;
  getOptionLabel: (option: T) => string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  fixedWidth?: string;
  shouldShowFullOptions?: boolean;
  onSelectChildren?: () => void;
  isSmall?: boolean;
  shouldAllowFreeInput?: boolean;
}

const Autocomplete: Component<AutocompleteProps> = (props) => {
  props = mergeProps(
    { fixedWidth: '244px', shouldShowFullOptions: false, placeholder: '', isSmall: false, shouldAllowFreeInput: false },
    props
  );
  const [t] = useI18n();
  const [selectedIndex, setSelectedIndex] = createSignal(-1);
  const [inputValue, setInputValue] = createSignal('');
  const [shouldShowDropdown, setShouldShowDropdown] = createSignal(false);
  let dropdownRef: HTMLDivElement;
  let inputRef: HTMLInputElement;

  createEffect(() => {
    if (props.value !== '' && inputValue() === '') {
      setInputValue(props.value);
    }
  });

  createEffect(() => {
    if (props.value === '') return setInputValue('');

    const selectedOption = props.options.find((option) => String(props.getOptionKey(option)) === String(props.value));

    if (!selectedOption) return;

    setInputValue(props.getOptionLabel(selectedOption));
  });

  const handleInputChange: JSX.DOMAttributes<HTMLInputElement>['onInput'] = (event) => {
    setInputValue(event.currentTarget.value);

    if (event.currentTarget.value === '' || props.shouldAllowFreeInput) {
      if (typeof props.onChange === 'function') props.onChange(event.currentTarget.value);
    }
  };

  const handleMouseDown = (event) => {
    event.stopPropagation();
  };

  const handleMouseMove = (event) => {
    event.stopPropagation();
  };

  const filteredOptions = createMemo(() => {
    if (props.shouldShowFullOptions) return props.options;

    return props.options.filter((option) => {
      const optionLabel = props.getOptionLabel(option);

      return optionLabel.includes(inputValue());
    });
  });

  createEffect(() => {
    const currentSelectedIndex = filteredOptions().findIndex(
      (filteredOption) => props.getOptionKey(filteredOption) === props.value
    );

    if (currentSelectedIndex > -1) setSelectedIndex(currentSelectedIndex);
  });

  const selectableLength = createMemo(() => (props.children ? filteredOptions().length + 1 : filteredOptions().length));

  const closeDropdown = () => {
    setShouldShowDropdown(false);
    setSelectedIndex(-1);

    if (props.children && selectedIndex() === selectableLength() - 1) {
      if (typeof props.onSelectChildren === 'function') props.onSelectChildren();
    }

    const selectedOption = filteredOptions()[selectedIndex()] || {};
    const selectedKey = props.getOptionKey(selectedOption);

    const finalOption = props.options.find(
      (option) => props.getOptionKey(option) === props.value || props.getOptionKey(option) === selectedKey
    );

    if (finalOption) {
      setInputValue(props.getOptionLabel(finalOption));

      if (props.getOptionKey(finalOption) !== props.value) {
        if (typeof props.onChange === 'function') props.onChange(props.getOptionKey(finalOption));
      }
    } else if (!props.shouldAllowFreeInput) {
      setInputValue('');
    }
  };

  const handleSelectItem = (option?: Record<string, unknown>) => () => {
    if (option && typeof props.onChange === 'function') props.onChange(props.getOptionKey(option));

    closeDropdown();
  };

  const dropdownItems = createMemo(() =>
    filteredOptions().map((option) => {
      const key = props.getOptionKey(option);
      const optionLabel = props.getOptionLabel(option);
      const selectedOption = filteredOptions()[selectedIndex()] || {};
      const selectedKey = props.getOptionKey(selectedOption);

      return {
        key,
        Component: () => (
          <div
            classList={{
              'CUI-Autocomplete__drop-down__item': true,
              'CUI-Autocomplete__drop-down__item--selected': selectedKey === key,
              'CUI-Autocomplete__drop-down__item--small': !!props.isSmall,
            }}
            onMouseDown={handleSelectItem(option)}
          >
            {optionLabel}
          </div>
        ),
      };
    })
  );

  const handleInputKeyDown = (event) => {
    if (!shouldShowDropdown) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      return setSelectedIndex((sI) => {
        if (sI + 1 === selectableLength()) return selectableLength() - 1;

        return sI + 1;
      });
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();

      return setSelectedIndex((sI) => {
        if (sI === 0) return 0;

        return sI - 1;
      });
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      event.currentTarget.blur();

      handleSelectItem(filteredOptions()[selectedIndex()])();
    }
  };

  const handleInputFocus = () => {
    setShouldShowDropdown(true);
  };

  const handleClose = () => {
    if (shouldShowDropdown) closeDropdown();
  };

  onMount(() => {
    const handleWheel = (event: WheelEvent) => {
      if ((dropdownRef && dropdownRef.contains(event.target as Node)) || dropdownRef === event.target) {
        event.stopPropagation();
      }
    };

    document.addEventListener('wheel', handleWheel, { capture: true });

    onCleanup(() => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
    });
  });

  return (
    <div class="CUI-Autocomplete" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove}>
      <FilledInput
        ref={inputRef}
        classList={{
          'CUI-Autocomplete__input': true,
          'CUI-Autocomplete__input--small': !!props.isSmall,
        }}
        placeholder={props.placeholder}
        value={inputValue()}
        onInput={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleInputKeyDown}
        width={props.fixedWidth}
      />
      <Show when={!props.shouldAllowFreeInput}>
        <ArrowDropDownIcon
          classList={{
            'CUI-Autocomplete__drop-down-icon': true,
            'CUI-Autocomplete__drop-down-icon--small': !!props.isSmall,
          }}
        />
      </Show>
      <Popover isOpen={shouldShowDropdown()} onClose={handleClose} anchorEl={inputRef} placement="bottom-start">
        <div
          ref={dropdownRef}
          classList={{
            'CUI-Autocomplete__drop-down': true,
            'CUI-Autocomplete__drop-down--hidden': !dropdownItems().length && props.shouldAllowFreeInput,
          }}
          style={{ width: props.fixedWidth }}
        >
          <Show
            when={dropdownItems().length > 0}
            fallback={
              <div
                classList={{
                  'CUI-Autocomplete__drop-down__no-matching-option': true,
                  'CUI-Autocomplete__drop-down__no-matching-option--small': !!props.isSmall,
                }}
              >
                {t('noMatchingOption')}
              </div>
            }
          >
            <For each={dropdownItems()}>{(dropdownItem) => <Dynamic component={dropdownItem.Component} />}</For>
          </Show>
          <Show when={!!props.children}>
            <div
              classList={{ 'CUI-Autocomplete__drop-down__item--selected': selectedIndex() === selectableLength() - 1 }}
            >
              {props.children}
            </div>
          </Show>
        </div>
      </Popover>
    </div>
  );
};

export default Autocomplete;
