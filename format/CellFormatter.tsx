import { type JSX } from "preact";
import { useMemo } from "preact/hooks";
import {
  type CellFormatting,
  type CellStyle,
  ConditionOperator,
  type DateFormatting,
  type NumberFormatting,
} from "./types.ts";

interface CellFormatterProps {
  value: any;
  formatting?: CellFormatting;
}

function evaluateCondition(
  value: any,
  operator: ConditionOperator,
  conditionValue: any,
): boolean {
  switch (operator) {
    case ConditionOperator.Equals:
      return value == conditionValue;
    case ConditionOperator.NotEquals:
      return value != conditionValue;
    case ConditionOperator.LessThan:
      return value < conditionValue;
    case ConditionOperator.GreaterThan:
      return value > conditionValue;
    case ConditionOperator.LessThanOrEqual:
      return value <= conditionValue;
    case ConditionOperator.GreaterThanOrEqual:
      return value >= conditionValue;
    default:
      return false;
  }
}

function formatNumber(value: any, options?: NumberFormatting): string {
  if (typeof value !== "number") return value;
  try {
    return new Intl.NumberFormat(options?.locale, options).format(value);
  } catch (e) {
    console.error(e);
    return value.toString();
  }
}

function formatDate(value: any, options: DateFormatting): string {
  const { granularity, locale } = options;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  const formatOptions: Intl.DateTimeFormatOptions = {};
  switch (granularity) {
    case "year":
      formatOptions.year = "numeric";
      break;
    case "month":
      formatOptions.year = "numeric";
      formatOptions.month = "short";
      break;
    case "day":
      formatOptions.year = "numeric";
      formatOptions.month = "short";
      formatOptions.day = "numeric";
      break;
    case "hour":
      formatOptions.year = "numeric";
      formatOptions.month = "short";
      formatOptions.day = "numeric";
      formatOptions.hour = "numeric";
      break;
    case "minute":
      formatOptions.year = "numeric";
      formatOptions.month = "short";
      formatOptions.day = "numeric";
      formatOptions.hour = "numeric";
      formatOptions.minute = "numeric";
      break;
    case "second":
      formatOptions.year = "numeric";
      formatOptions.month = "short";
      formatOptions.day = "numeric";
      formatOptions.hour = "numeric";
      formatOptions.minute = "numeric";
      formatOptions.second = "numeric";
      break;
    case "auto":
    default:
      return d.toLocaleString(locale);
  }

  try {
    return new Intl.DateTimeFormat(locale, formatOptions).format(d);
  } catch (e) {
    console.error(e);
    return d.toLocaleString(locale);
  }
}

export const CellFormatter = (
  { value, formatting }: CellFormatterProps,
): JSX.Element => {
  if (!formatting) {
    return <span>{value}</span>;
  }

  let displayValue: any = value;
  let style: CellStyle | undefined = undefined;

  if (formatting.date) {
    displayValue = formatDate(value, formatting.date);
  } else if (formatting.number) {
    displayValue = formatNumber(Number(value), formatting.number);
  }

  if (formatting.style) {
    const { default: defaultStyle, conditions } = formatting.style;
    style = defaultStyle;

    for (const condition of conditions) {
      if (evaluateCondition(value, condition.operator, condition.value)) {
        style = condition.style;
        break;
      }
    }
  }

  return (
    <span style={style as any}>
      {displayValue}
    </span>
  );
};
