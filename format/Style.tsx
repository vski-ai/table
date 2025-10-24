import { Signal } from "@preact/signals";
import { CellStyle, ConditionOperator, StyleCondition } from "./types.ts";

import Trash2Icon from "lucide-react/dist/esm/icons/trash-2.js";

const StyleEditor = (
  { style, onStyleChange }: {
    style: CellStyle;
    onStyleChange: (newStyle: CellStyle) => void;
  },
) => {
  const isBold = style?.fontWeight === "bold";
  const isItalic = style?.fontStyle === "italic";
  const isUnderline = style?.textDecoration === "underline";

  const toggleBold = () => {
    onStyleChange({ ...style, fontWeight: isBold ? "normal" : "bold" });
  };

  const toggleItalic = () => {
    onStyleChange({ ...style, fontStyle: isItalic ? "normal" : "italic" });
  };

  const toggleUnderline = () => {
    onStyleChange({
      ...style,
      textDecoration: isUnderline ? "none" : "underline",
    });
  };

  return (
    <div class="flex gap-2">
      <input
        type="color"
        class="btn p-1 w-12"
        value={style?.color}
        onInput={(e) =>
          onStyleChange({ ...style, color: e.currentTarget.value })}
      />
      <div class="btn-group flex gap-1">
        <button
          class={`btn ${isBold ? "btn-active" : ""}`}
          onClick={toggleBold}
        >
          B
        </button>
        <button
          class={`btn ${isItalic ? "btn-active" : ""}`}
          onClick={toggleItalic}
        >
          I
        </button>
        <button
          class={`btn ${isUnderline ? "btn-active" : ""}`}
          onClick={toggleUnderline}
        >
          U
        </button>
      </div>
    </div>
  );
};

export const StyleFormatting = (
  { column, formatting }: { column: string; formatting: Signal<any> },
) => {
  const style = formatting.value[column]?.style ||
    { default: {}, conditions: [] };

  const onDefaultStyleChange = (newStyle: CellStyle) => {
    formatting.value = {
      ...formatting.value,
      [column]: {
        ...formatting.value[column],
        style: {
          ...style,
          default: newStyle,
        },
      },
    };
  };

  const onConditionChange = (index: number, newCondition: StyleCondition) => {
    const newConditions = [...style.conditions];
    newConditions[index] = newCondition;
    formatting.value = {
      ...formatting.value,
      [column]: {
        ...formatting.value[column],
        style: {
          ...style,
          conditions: newConditions,
        },
      },
    };
  };

  const addCondition = () => {
    const newConditions = [...style.conditions, {
      operator: ConditionOperator.Equals,
      value: "",
      style: {},
    }];
    formatting.value = {
      ...formatting.value,
      [column]: {
        ...formatting.value[column],
        style: {
          ...style,
          conditions: newConditions,
        },
      },
    };
  };

  const removeCondition = (index: number) => {
    const newConditions = style.conditions.filter((_: any, i: number) =>
      i !== index
    );
    formatting.value = {
      ...formatting.value,
      [column]: {
        ...formatting.value[column],
        style: {
          ...style,
          conditions: newConditions,
        },
      },
    };
  };

  return (
    <div class="flex flex-col gap-3 py-6">
      <StyleEditor
        style={style.default}
        onStyleChange={onDefaultStyleChange}
      />

      {style.conditions.map((condition: any, index: number) => (
        <div class="flex flex-col gap-2 mt-2 border border-dashed rounded w-full p-2">
          <div class="flex gap-2">
            <select
              class="select select-bordered"
              value={condition.operator}
              onChange={(e) => {
                onConditionChange(index, {
                  ...condition,
                  operator: e.currentTarget.value as ConditionOperator,
                });
              }}
            >
              {Object.values(ConditionOperator).map((op) => (
                <option value={op}>{op}</option>
              ))}
            </select>
            <input
              type="text"
              class="input input-bordered"
              value={condition.value}
              onInput={(e) => {
                onConditionChange(index, {
                  ...condition,
                  value: e.currentTarget.value,
                });
              }}
            />
          </div>
          <div class="flex justify-between">
            <StyleEditor
              style={condition.style}
              onStyleChange={(newStyle) => {
                onConditionChange(index, { ...condition, style: newStyle });
              }}
            />
            <button
              class="btn btn-ghost"
              onClick={(e) => {
                e.stopPropagation();
                removeCondition(index);
              }}
            >
              <Trash2Icon />
            </button>
          </div>
        </div>
      ))}
      <button class="btn mt-2" onClick={addCondition}>Add Condition</button>
    </div>
  );
};
