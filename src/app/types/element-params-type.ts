export interface ElementParams {
  tag: string;
  classes?: string;
  text?: string;
  html?: string;
  id?: string;
}

export interface ElementInputParams extends Partial<ElementParams> {
  type?: string;
  value?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  list?: string;
}

export interface ElementButtonParams extends Partial<ElementParams> {
  disabled?: boolean;
}

export interface ElementAnchorParams extends Partial<ElementParams> {
  href: string;
}

export interface ElementOptionParams extends Partial<ElementParams> {
  value: string;
}
