'use client';

import { InputHTMLAttributes, useRef, RefObject, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';
import Spinner from './Spinner';
import { clsx } from 'clsx/lite';
import { FieldSetType, AnnotatedTag } from '@/photo/form';
import TagInput from './TagInput';
import { parameterize } from '@/utility/string';
import Checkbox from './Checkbox';
import ResponsiveText from './primitives/ResponsiveText';
import Tooltip from './Tooltip';
import { SelectMenuOptionType } from './SelectMenuOption';
import SelectMenu from './SelectMenu';

export default function FieldsetWithStatus({
  id: _id,
  label,
  icon,
  note,
  noteShort,
  tooltip,
  error,
  value,
  isModified,
  onChange,
  className,
  selectOptions,
  selectOptionsDefaultLabel,
  tagOptions,
  tagOptionsLimit,
  tagOptionsLimitValidationMessage,
  tagOptionsDefaultIcon,
  placeholder,
  loading,
  required,
  readOnly,
  spellCheck,
  capitalize,
  type = 'text',
  inputRef: inputRefProp,
  accessory,
  hideLabel,
  tabIndex,
}: {
  id?: string
  label: string
  icon?: ReactNode
  note?: string
  noteShort?: string
  tooltip?: string
  error?: string
  value: string
  isModified?: boolean
  onChange?: (value: string) => void
  className?: string
  selectOptions?: SelectMenuOptionType[]
  selectOptionsDefaultLabel?: string
  tagOptions?: AnnotatedTag[]
  tagOptionsLimit?: number
  tagOptionsLimitValidationMessage?: string
  tagOptionsDefaultIcon?: ReactNode
  placeholder?: string
  loading?: boolean
  required?: boolean
  readOnly?: boolean
  spellCheck?: boolean
  capitalize?: boolean
  type?: FieldSetType
  inputRef?: RefObject<HTMLInputElement | null>
  accessory?: React.ReactNode
  hideLabel?: boolean
  tabIndex?: number
}) {
  const inputRefInternal = useRef<HTMLInputElement>(null);

  const inputRef = inputRefProp ?? inputRefInternal;

  const id = _id || parameterize(label);

  const { pending } = useFormStatus();

  const inputProps: InputHTMLAttributes<HTMLInputElement> = {
    id,
    name: id,
    type,
    value,
    checked: type === 'checkbox'
      ? value === 'true' ? true : false
      : undefined,
    placeholder,
    onChange: e => onChange?.(type === 'checkbox'
      ? e.target.value === 'true' ? 'false' : 'true'
      : e.target.value),
    spellCheck,
    autoComplete: 'off',
    autoCapitalize: !capitalize ? 'off' : undefined,
    readOnly: readOnly || pending || loading,
    disabled: type === 'checkbox' && (
      readOnly || pending || loading
    ),
    className: clsx(
      (
        type === 'text' ||
        type === 'email' ||
        type === 'password'
      ) && 'w-full',
      type === 'checkbox' && (
        readOnly || pending || loading
      ) && 'opacity-50 cursor-not-allowed',
      Boolean(error) && 'error',
    ),
    tabIndex,
  };

  return (
    type === 'hidden'
      ? <input ref={inputRef} {...inputProps} />
      : <div className={clsx(
        // For managing checkbox active state
        'group',
        'space-y-1',
        type === 'checkbox' && 'flex items-center gap-2',
        className,
      )}>
        {!hideLabel &&
          <label
            htmlFor={id}
            className={clsx(
              'inline-flex flex-wrap gap-x-2 items-center select-none',
              type === 'checkbox' && 'order-2 m-0 translate-y-[0.25px]',
              type === 'checkbox' && readOnly &&
                'opacity-50 cursor-not-allowed',
            )}
          >
            <span className="inline-flex items-center gap-x-[5px]">
              {icon &&
                <span className={clsx(
                  'inline-flex items-center justify-center w-4 shrink-0',
                )}>
                  {icon}
                </span>}
              <span className="truncate">
                {label}
              </span>
              {tooltip &&
                <Tooltip
                  content={tooltip}
                  classNameTrigger="translate-y-[-1.5px] text-dim"
                  supportMobile
                />}
            </span>
            {note && !error &&
              <ResponsiveText
                className="text-gray-400 dark:text-gray-600"
                shortText={`(${noteShort})`}
              >
                ({note})
              </ResponsiveText>}
            {isModified && !error &&
              <span className={clsx(
                'text-main font-medium text-[0.9rem]',
                ' -ml-1.5 translate-y-[-1px]',
              )}>
                *
              </span>}
            {error &&
              <span className="text-error">
                {error}
              </span>}
            {required &&
              <span className="text-gray-400 dark:text-gray-600">
                Required
              </span>}
            {loading && type !== 'checkbox' &&
              <span className="translate-y-[1.5px]">
                <Spinner />
              </span>}
          </label>}
        <div className="flex gap-2">
          {selectOptions
            ? <SelectMenu
              id={id}
              name={id}
              tabIndex={tabIndex}
              className="w-full"
              value={value}
              onChange={onChange}
              options={selectOptions}
              defaultOptionLabel={selectOptionsDefaultLabel}
              error={error}
              readOnly={readOnly || pending || loading}
            />
            : tagOptions
              ? <TagInput
                id={id}
                name={id}
                value={value}
                options={tagOptions}
                defaultIcon={tagOptionsDefaultIcon}
                onChange={onChange}
                showMenuOnDelete={tagOptionsLimit === 1}
                className={clsx(Boolean(error) && 'error')}
                readOnly={readOnly || pending || loading}
                placeholder={placeholder}
                limit={tagOptionsLimit}
                limitValidationMessage={tagOptionsLimitValidationMessage}
              />
              : type === 'textarea'
                ? <textarea
                  id={id}
                  name={id}
                  value={value}
                  placeholder={placeholder}
                  onChange={e => onChange?.(e.target.value)}
                  readOnly={readOnly || pending || loading}
                  spellCheck={spellCheck}
                  autoCapitalize={!capitalize ? 'off' : undefined}
                  className={clsx(
                    'w-full h-24 resize-none',
                    Boolean(error) && 'error',
                  )}
                />
                : type === 'checkbox'
                  ? <Checkbox
                    ref={inputRef}
                    accessory={loading && <Spinner
                      className="translate-y-[0.5px]"
                    />}
                    {...inputProps}
                  />
                  : <input
                    ref={inputRef}
                    {...inputProps}
                  />}
          {accessory && <div>
            {accessory}
          </div>}
        </div>
      </div>
  );
};
