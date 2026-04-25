# Localization

All user-facing display text must be added to the relevant locale file under `/locales` (e.g. `/locales/da.json`) rather than hardcoded inline in components. Reference the locale key in the component instead of writing the string directly.

# Component structure

All React component should be placed in a new folder, called the component name, containing a ts-file, called the name of the component. If the compontent is styled, add a css-file, called the name of the compoennt, ie folder name: react-component, ts-file: react-component.ts and css file react.component.css

# Component naming

All React components should be created like below. If props, specify them directly in the generic argument instead of creating a separate type. Always destructure props.

```ts
export const ComponentName: React.FC<{example:string}> = ({example}) => {
    return <div>{example}</div>
}
```

# Component styling

All css style should be placed in a separate css-file. Do not use inline styling.For naming, use BEM notation.

# Function declaration

Don't use the keyword 'function'. Instead, use arrow function notation.

# Function usage

Don't create functions in jsx. Instead, create them before jsx is returned and assign them to a variable.

# Self assessment

After every change, give me a % confidence that your fix actually solves the issue, and a short explanation why.
