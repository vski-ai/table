export enum FormattingType {
  Style = "style",
  Date = "date",
}

export enum ConditionOperator {
  Equals = "==",
  NotEquals = "!=",
  LessThan = "<",
  GreaterThan = ">",
  LessThanOrEqual = "<=",
  GreaterThanOrEqual = ">=",
}

export type StyleScope = "column" | "row" | "cell";

export interface CellStyle extends Record<string, string | undefined> {
  "color"?: string;
  "background-color"?: string;
  "font-weight"?: "normal" | "bold";
  "font-style"?: "normal" | "italic";
  "text-Decoration"?: "none" | "underline";
}

export interface StyleCondition {
  operator: ConditionOperator;
  value: any;
  style: CellStyle;
}

export interface DateFormatting {
  granularity: string;
  locale?: string;
}

export interface NumberFormatting {
  locale?: string;
  style?: "decimal" | "currency" | "percent" | "unit";
  currency?: string;
  currencyDisplay?: "symbol" | "narrowSymbol" | "code" | "name";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  unit?: string;
  unitDisplay?: "short" | "long" | "narrow";
}

export interface CellFormatting {
  type?: FormattingType;
  style?: {
    default: CellStyle;
    conditions: StyleCondition[];
  };
  date?: DateFormatting;
  number?: NumberFormatting;
  prefix?: string;
  suffix?: string;
}
