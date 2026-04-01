# Localization

All user-facing display text must be added to the relevant locale file under `/locales` (e.g. `/locales/da.json`) rather than hardcoded inline in components. Reference the locale key in the component instead of writing the string directly.

# Component naming

All React component should be created like below. If props, specify them directly in the genric argument instead of creating a separate type. Always destructure props.

```ts
export const ComponentName: React.FC<{example:string}> = ({example}) => {
    return <div>{example}</div>
}

``
```
