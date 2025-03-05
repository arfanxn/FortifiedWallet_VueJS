export namespace SelectFieldComponent {
  export interface Props<T> {
    name: string
    label?: string
    disabled?: boolean
    value?: T
    options: SelectFieldComponent.Props.Option<T>[]
  }

  export namespace Props {
    export interface Option<T> {
      text: string
      key?: string
      value: T
    }
  }
}
