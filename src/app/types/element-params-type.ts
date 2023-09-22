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

export interface ElementDialogParams extends Partial<ElementParams> {}

export interface ElementButtonParams extends Partial<ElementParams> {
  disabled?: boolean;
}

export interface ElementAnchorParams extends Partial<ElementParams> {
  href: string;
}

export interface ElementImageParams extends Partial<ElementParams> {
  src: string;
  alt: string;
}

export interface ElementOptionParams extends Partial<ElementParams> {
  value: string;
  hidden?: boolean;
}

export interface ElementLabelParams extends Partial<ElementParams> {
  for: string;
}

export interface ElementSelectParams extends Partial<ElementParams> {
  disabled?: boolean;
}
