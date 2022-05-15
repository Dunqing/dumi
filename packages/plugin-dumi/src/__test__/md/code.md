```tsx | pure
renderFormItem: (
  _,
  { type, defaultRender, formItemProps, fieldProps, ...rest },
  form
) => {
  if (type === 'form') return null

  const status = form.getFieldValue('state')
  if (status !== 'open') {
    return (
      // value 和 onchange 会通过 form 自动注入。
      <Input
        // 组件的配置
        {...fieldProps}
        // 自定义配置
        placeholder="请输入test"
      />
    )
  }
  return defaultRender(_)
}
```

`renderFormItem` 的定义, 具体的值可以打开控制台查看。

```tsx | pure
 renderFormItem?: (
    item: ProColumns<T>,
    config: {
      value?: any;
      onSelect?: (value: any) => void;
      type: ProTableTypes;
      defaultRender: (newItem: ProColumns<any>) => JSX.Element | null;
    },
    form: FormInstance,
  ) => JSX.Element | false | null;
```

<code src="../examples/code.tsx" background="#f5f5f5" height="310px" title="搜索表单自定义" />