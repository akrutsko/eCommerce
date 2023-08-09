export interface ElementParams {
  tag: string;
  classes?: string;
  text?: string;
  html?: string;
  id?: string;
}

export interface ElementInputParams extends ElementParams {
  type?: string;
  value?: string;
  name?: string;
  placeholder?: string;
}

export interface ElementButtonParams extends ElementParams {
  disabled?: boolean;
}

export interface ElementAnchorParams extends ElementParams {
  href: string;
}
