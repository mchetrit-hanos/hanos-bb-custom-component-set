(() => ({
  name: 'Conditional',
  icon: 'ConditionalIcon',
  category: 'LOGIC',
  keywords: ['Logic', 'conditional'],
  structure: [
    {
      name: 'ConditionalWithSetValues',
      options: [
        {
          value: true,
          label: 'Initial visibility',
          key: 'visible',
          type: 'TOGGLE',
          configuration: {
            as: 'VISIBILITY',
          },
        },
        {
          type: 'VARIABLE',
          label: 'Left',
          key: 'left',
          value: [],
        },
        {
          type: 'CUSTOM',
          label: 'Compare',
          key: 'compare',
          value: 'eq',
          configuration: {
            as: 'DROPDOWN',
            dataType: 'string',
            allowedInput: [
              {
                name: 'Equals',
                value: 'eq',
              },
              {
                name: 'Not equal',
                value: 'neq',
              },
              {
                name: 'Contains',
                value: 'contains',
              },
              {
                name: 'Does not contain',
                value: 'notcontains',
              },
              {
                name: 'Greater than',
                value: 'gt',
              },
              {
                name: 'Less than',
                value: 'lt',
              },
              {
                name: 'Greater than or equal to',
                value: 'gteq',
              },
              {
                name: 'Less than or equal to',
                value: 'lteq',
              },
            ],
          },
        },
        {
          type: 'VARIABLE',
          label: 'Right',
          key: 'right',
          value: [],
        },
      ],
      descendants: [],
    },
  ],
}))();
