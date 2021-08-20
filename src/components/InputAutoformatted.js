(() => ({
    name: 'InputAutoformatted',
    type: 'CONTENT_COMPONENT',
    allowedTypes: [],
    orientation: 'HORIZONTAL',
    jsx: (() => {
        const {
            autoComplete,
            disabled,
            error,
            multiline,
            rows,
            placeholder,
            variant,
            type,
            size,
            fullWidth,
            margin,
            helperText,
            adornment,
            adornmentIcon,
            adornmentPosition,
            pattern,
            minlength,
            maxlength,
            minvalue,
            maxvalue,
            validationTypeMismatch,
            validationPatternMismatch,
            validationValueMissing,
            validationTooLong,
            validationTooShort,
            validationBelowMinimum,
            validationAboveMaximum,
            hideLabel,
            customModelAttribute: customModelAttributeObj,
            nameAttribute,
        } = options;

        const {
            FormControl,
            Input,
            OutlinedInput,
            FilledInput,
            InputLabel,
            FormHelperText,
            InputAdornment,
            IconButton,
        } = window.MaterialUI.Core;
        const { Icons } = window.MaterialUI;

        const { env, getCustomModelAttribute, useText } = B;
        const isDev = env === 'dev';
        const isNumberType = type === 'number';
        const isPasswordType = type === 'password';
        const [isDisabled, setIsDisabled] = useState(disabled);
        const [showPassword, togglePassword] = useState(false);
        const [errorState, setErrorState] = useState(error);
        const [afterFirstInvalidation, setAfterFirstInvalidation] = useState(false);
        const [helper, setHelper] = useState(useText(helperText));
        const {
            id: customModelAttributeId,
            label = [],
            value: defaultValue = [],
            required: defaultRequired = false,
        } = customModelAttributeObj;
        const [currentValue, setCurrentValue] = useState(
            useText(defaultValue, { rawValue: true }),
        );
        const labelText = useText(label);
        const customModelAttribute = getCustomModelAttribute(
            customModelAttributeId,
        );

        const {
            name: customModelAttributeName,
            validations: { required: attributeRequired } = {},
        } = customModelAttribute || {};

        const required = customModelAttribute ? attributeRequired : defaultRequired;
        const nameAttributeValue = useText(nameAttribute);

        const validPattern = pattern || null;
        const validMinlength = minlength || null;
        const validMaxlength = maxlength || null;
        const validMinvalue = minvalue || null;
        const validMaxvalue = maxvalue || null;

        const validationMessage = validityObject => {
            if (validityObject.customError && validationPatternMismatch) {
                return useText(validationPatternMismatch);
            }
            if (validityObject.valid) {
                return '';
            }
            if (validityObject.typeMismatch && validationTypeMismatch) {
                return useText(validationTypeMismatch);
            }
            if (validityObject.patternMismatch && validationPatternMismatch) {
                return useText(validationPatternMismatch);
            }
            if (validityObject.valueMissing && validationValueMissing) {
                return useText(validationValueMissing);
            }
            if (validityObject.tooLong && validationTooLong) {
                return useText(validationTooLong);
            }
            if (validityObject.tooShort && validationTooShort) {
                return useText(validationTooShort);
            }
            if (validityObject.rangeUnderflow && validationBelowMinimum) {
                return useText(validationBelowMinimum);
            }
            if (validityObject.rangeOverflow && validationAboveMaximum) {
                return useText(validationAboveMaximum);
            }
            return '';
        };

        const placeholderText = useText(placeholder);

        const handleValidation = validation => {
            setErrorState(!validation.valid);
            const message = validationMessage(validation) || useText(helperText);
            setHelper(message);
        };

        const onKeyDown = event => {
            if (isNumberType && (event.key === '.' || event.key === ',')) {
                event.preventDefault();
            }
        };

        const customPatternValidation = target => {
            const { value: eventValue, validity } = target;
            if (!pattern) {
                return validity;
            }
            const patternRegex = RegExp(`^${pattern}$`);
            const isValid = patternRegex.test(eventValue);
            target.setCustomValidity(isValid ? '' : 'Invalid field.');
            return {
                ...validity,
                valid: isValid,
                patternMismatch: !isValid,
            };
        };

        const changeHandler = event => {
            const { target } = event;
            let { validity: validation } = target;
            const { value: eventValue } = target;

            if (isNumberType || multiline) {
                validation = customPatternValidation(target);
            }
            const numberValue =
                isNumberType && eventValue && parseInt(eventValue, 10);

            if (afterFirstInvalidation) {
                handleValidation(validation);
            }
            // debugger;
            const value = isNumberType ? numberValue : formatCurrency(eventValue);
            setCurrentValue(value);
            B.triggerEvent('onChange', value);
        };

        const blurHandler = event => {
            const { target } = event;
            let { validity: validation } = target;

            if (isNumberType || multiline) {
                validation = customPatternValidation(target);
            }

            setAfterFirstInvalidation(!validation.valid);
            handleValidation(validation);
        };

        const invalidHandler = event => {
            event.preventDefault();
            const {
                target: {
                    validity,
                    validity: { valid: isValid },
                },
            } = event;
            setAfterFirstInvalidation(!isValid);
            handleValidation(validity);
        };

        B.defineFunction('Clear', () => setCurrentValue(''));
        B.defineFunction('Enable', () => setIsDisabled(false));
        B.defineFunction('Disable', () => setIsDisabled(true));
        B.defineFunction('Reset', () =>
            setCurrentValue(useText(defaultValue, { rawValue: true })),
        );

        const handleClickShowPassword = () => {
            togglePassword(!showPassword);
        };

        const handleMouseDownPassword = event => {
            event.preventDefault();
        };

        let InputCmp = Input;
        if (variant === 'outlined') {
            InputCmp = OutlinedInput;
        } else if (variant === 'filled') {
            InputCmp = FilledInput;
        }

        const passwordIcon = showPassword ? 'Visibility' : 'VisibilityOff';
        const inputIcon = isPasswordType ? passwordIcon : adornmentIcon;
        const hasIcon = inputIcon && inputIcon !== 'none';
        const hasAdornment = isPasswordType
            ? adornment && hasIcon
            : adornment || hasIcon;

        const IconCmp =
            hasIcon &&
            React.createElement(Icons[inputIcon], {
                fontSize: size,
            });

        const iconButtonOptions = {
            edge: adornmentPosition,
            tabIndex: isDev && -1,
        };
        if (isPasswordType) {
            iconButtonOptions.ariaLabel = 'toggle password visibility';
            iconButtonOptions.onClick = handleClickShowPassword;
            iconButtonOptions.onMouseDown = handleMouseDownPassword;
        }

        const formatNumber = (n) => {
            // format number 1000000 to 1,234,567
            return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
        const formatCurrency = (input, blur) => {
            // appends $ to value, validates decimal side
            // and puts cursor back in right position.
            // debugger;
            // get input value
            let input_val = input;

            // don't validate empty input
            if (input_val === "") { return; }

            // original length
            var original_len = input_val.length;

            // check for decimal
            if (input_val.indexOf(",") >= 0) {

                // get position of first decimal
                // this prevents multiple decimals from
                // being entered
                const decimal_pos = input_val.indexOf(",");

                // split number by decimal point
                var left_side = input_val.substring(0, decimal_pos);
                var right_side = input_val.substring(decimal_pos);

                // add commas to left side of number
                left_side = formatNumber(left_side);

                // validate right side
                right_side = formatNumber(right_side);

                // On blur make sure 2 numbers after decimal
                // if (blur === "blur") {
                //   right_side += "00";
                // }

                // Limit decimal to only 2 digits
                right_side = right_side.substring(0, 2);

                // join number by .
                input_val = left_side + "," + right_side;

            } else {
                // no decimal entered
                // add commas to number
                // remove all non-digits
                input_val = formatNumber(input_val);

                // final formatting
                // if (blur === "blur") {
                //   input_val += ",00";
                // }
            }

            // send updated string to input
            // input.val(input_val);

            // put caret back in the right position
            //   var updated_len = input_val.length;
            //   caret_pos = updated_len - original_len + caret_pos;
            //   input[0].setSelectionRange(caret_pos, caret_pos);

            return input_val;
        }

        useEffect(() => {
            if (isDev) {
                setCurrentValue(useText(defaultValue));
                setHelper(useText(helperText));
            }
        }, [isDev, defaultValue, helperText]);

        const TextFieldCmp = (
            <FormControl
                classes={{ root: classes.formControl }}
                variant={variant}
                size={size}
                fullWidth={fullWidth}
                required={required}
                disabled={isDisabled}
                margin={margin}
                error={errorState}
            >
                {labelText && !hideLabel && (
                    <InputLabel classes={{ root: classes.label }}>{labelText}</InputLabel>
                )}
                <InputCmp
                    name={nameAttributeValue || customModelAttributeName}
                    value={currentValue}
                    type={(isDev && type === 'number') || showPassword ? 'text' : type}
                    multiline={multiline}
                    autoComplete={autoComplete ? 'on' : 'off'}
                    rows={rows}
                    label={labelText}
                    placeholder={placeholderText}
                    onKeyDown={onKeyDown}
                    onChange={changeHandler}
                    onBlur={blurHandler}
                    onInvalid={invalidHandler}
                    startAdornment={
                        hasAdornment &&
                        adornmentPosition === 'start' && (
                            <InputAdornment position={adornmentPosition}>
                                {hasIcon ? (
                                    <IconButton {...iconButtonOptions}>{IconCmp}</IconButton>
                                ) : (
                                    adornment
                                )}
                            </InputAdornment>
                        )
                    }
                    endAdornment={
                        hasAdornment &&
                        adornmentPosition === 'end' && (
                            <InputAdornment position={adornmentPosition}>
                                {hasIcon ? (
                                    <IconButton {...iconButtonOptions}>{IconCmp}</IconButton>
                                ) : (
                                    adornment
                                )}
                            </InputAdornment>
                        )
                    }
                    inputProps={{
                        pattern: validPattern,
                        minlength: validMinlength,
                        maxlength: validMaxlength,
                        min: validMinvalue,
                        max: validMaxvalue,
                        tabIndex: isDev && -1,
                    }}
                />
                {helper && (
                    <FormHelperText classes={{ root: classes.helper }}>
                        {helper}
                    </FormHelperText>
                )}
            </FormControl>
        );

        return isDev ? (
            <div className={classes.root}>{TextFieldCmp}</div>
        ) : (
            TextFieldCmp
        );
    })(),
    styles: B => t => {
        const { Styling } = B;
        const style = new Styling(t);
        return {
            root: {
                display: ({ options: { fullWidth } }) =>
                    fullWidth ? 'block' : 'inline-block',
                '& > *': {
                    pointerEvents: 'none',
                },
            },
            label: {
                color: ({ options: { labelColor } }) => [
                    style.getColor(labelColor),
                    '!important',
                ],
                '&.Mui-focused': {
                    color: ({ options: { borderFocusColor } }) => [
                        style.getColor(borderFocusColor),
                        '!important',
                    ],
                },
                '&.Mui-error, &.Mui-error .Mui-error': {
                    color: ({ options: { errorColor } }) => [
                        style.getColor(errorColor),
                        '!important',
                    ],
                },
                '&.Mui-disabled': {
                    pointerEvents: 'none',
                    opacity: '0.7',
                },
            },
            helper: {
                color: ({ options: { helperColor } }) => [
                    style.getColor(helperColor),
                    '!important',
                ],
                '&.Mui-error': {
                    color: ({ options: { errorColor } }) => [
                        style.getColor(errorColor),
                        '!important',
                    ],
                },
            },
            formControl: {
                '& .MuiInputBase-root': {
                    color: ({ options: { textColor } }) => [
                        style.getColor(textColor),
                        '!important',
                    ],
                    backgroundColor: ({ options: { backgroundColor, variant } }) =>
                        variant !== 'standard' && [
                            style.getColor(backgroundColor),
                            '!important',
                        ],
                    '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline, & .MuiFilledInput-underline, & .MuiInput-underline': {
                            borderColor: ({ options: { borderHoverColor } }) => [
                                style.getColor(borderHoverColor),
                                '!important',
                            ],
                        },
                    },
                    '&.Mui-focused, &.Mui-focused:hover': {
                        '& .MuiOutlinedInput-notchedOutline, & .MuiFilledInput-underline, & .MuiInput-underline': {
                            borderColor: ({ options: { borderFocusColor } }) => [
                                style.getColor(borderFocusColor),
                                '!important',
                            ],
                        },
                    },
                    '& fieldset': {
                        top: ({ options: { hideLabel } }) => (hideLabel ? 0 : null),
                    },
                    '& legend': {
                        display: ({ options: { hideLabel } }) =>
                            hideLabel ? ['none', '!important'] : null,
                        overflow: 'hidden',
                    },
                    '& input': {
                        '&::placeholder': {
                            color: ({ options: { placeholderColor } }) => [
                                style.getColor(placeholderColor),
                                '!important',
                            ],
                        },
                    },
                    '&.Mui-disabled': {
                        pointerEvents: 'none',
                        opacity: '0.7',
                    },
                },
                '& .MuiIconButton-root': {
                    color: ({ options: { textColor } }) => [
                        style.getColor(textColor),
                        '!important',
                    ],
                },
                '& .MuiOutlinedInput-notchedOutline, & .MuiFilledInput-underline, & .MuiInput-underline': {
                    borderColor: ({ options: { borderColor } }) => [
                        style.getColor(borderColor),
                        '!important',
                    ],
                },
                '& .MuiInput-underline, & .MuiFilledInput-underline': {
                    '&::before, &::after': {
                        borderColor: ({ options: { borderColor } }) => [
                            style.getColor(borderColor),
                            '!important',
                        ],
                    },
                    '&:hover': {
                        '&::before, &::after': {
                            borderColor: ({ options: { borderHoverColor } }) => [
                                style.getColor(borderHoverColor),
                                '!important',
                            ],
                        },
                    },
                    '&.Mui-focused::before, &.Mui-focused::after, &.Mui-focused:hover::before, &.Mui-focused:hover::after': {
                        borderColor: ({ options: { borderFocusColor } }) => [
                            style.getColor(borderFocusColor),
                            '!important',
                        ],
                    },
                },
                '& .MuiInputBase-root.Mui-error, & .MuiInputBase-root.Mui-error:hover, & .MuiInputBase-root.Mui-error.Mui-focused, & .MuiInputBase-root.Mui-error.Mui-focused:hover': {
                    '& .MuiOutlinedInput-notchedOutline, & .MuiFilledInput-underline, & .MuiInput-underline': {
                        borderColor: ({ options: { errorColor } }) => [
                            style.getColor(errorColor),
                            '!important',
                        ],
                    },
                    '&.MuiInput-underline, &.MuiFilledInput-underline': {
                        '&::before, &::after': {
                            borderColor: ({ options: { errorColor } }) => [
                                style.getColor(errorColor),
                                '!important',
                            ],
                        },
                        '&:hover': {
                            '&::before, &::after': {
                                borderColor: ({ options: { errorColor } }) => [
                                    style.getColor(errorColor),
                                    '!important',
                                ],
                            },
                        },
                        '&.Mui-focused::before, &.Mui-focused::after, &.Mui-focused:hover::before, &.Mui-focused:hover::after': {
                            borderColor: ({ options: { errorColor } }) => [
                                style.getColor(errorColor),
                                '!important',
                            ],
                        },
                    },
                },
            },
        };
    },
}))();
