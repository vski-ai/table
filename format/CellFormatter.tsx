import { type JSX } from "preact";
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
  const { granularity, showAsSpan, locale } = options;
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;

  if (showAsSpan) {
    const d2 = new Date(d);
    if (granularity === "year") d2.setFullYear(d.getFullYear() + 1);
    else if (granularity === "month") d2.setMonth(d.getMonth() + 1);
    else if (granularity === "week") d2.setDate(d.getDate() + 7);
    else if (granularity === "day") d2.setDate(d.getDate() + 1);
    else if (granularity === "hour") d2.setHours(d.getHours() + 1);
    else if (granularity === "minute") d2.setMinutes(d.getMinutes() + 1);
    else if (granularity === "second") d2.setSeconds(d.getSeconds() + 1);
    return `${d.toLocaleString(locale)} - ${d2.toLocaleString(locale)}`;
  }

  return d.toLocaleString(locale);
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
  } else if (formatting.number && typeof value === "number") {
    displayValue = formatNumber(value, formatting.number);
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

  const { prefix, suffix } = formatting;

  return (
    <span style={style as any}>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
};
