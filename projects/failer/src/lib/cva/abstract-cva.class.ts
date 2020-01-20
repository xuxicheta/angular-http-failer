export abstract class AbstractCVA {
  protected onChange = (value: any) => { };
  protected onTouched = () => { };
  registerOnChange = (fn: (value: any) => {}) => this.onChange = fn;
  registerOnTouched = (fn: () => {}) => this.onTouched = fn;

  abstract writeValue(outsideValue: any): void;
  abstract updateValue(insideValue: any): void;
}
