import { faker } from "@faker-js/faker";

interface GroupDataItem {
  id: string;
  $parent_id: string[] | null;
  $group_by: string;
  $group_level: number;
  name: string;
  company: string;
  sex: string;
  user: string;
  bonus: string;
  hours: number;
  timestamp: string;
  $is_group_root?: boolean;
}

// Let's define a recursive function to generate nested group data
export function generateGroupData(
  level = 0,
  maxLevel = 3,
  parentId: string[] | null = null,
): GroupDataItem[] {
  const items: GroupDataItem[] = [];
  const numItems = 5;
  const groups = ["company", "sex", "name", "hours"];
  for (let i = 0; i < numItems; i++) {
    const id = faker.string.uuid();
    const isGroup = level < maxLevel && faker.datatype.boolean();

    const baseItem: GroupDataItem = {
      id,
      $parent_id: parentId,
      $group_by: groups[level],
      $group_level: level,
      name: faker.person.fullName(),
      company: faker.company.name(),
      sex: faker.person.sex(),
      user: "",
      bonus: faker.commerce.price(),
      hours: faker.number.int({ min: 1, max: 100 }),
      timestamp: faker.date.recent().toISOString(),
    };
    if (isGroup) {
      baseItem.$is_group_root = true;
      items.push(baseItem);
      const children: GroupDataItem[] = generateGroupData(
        level + 1,
        maxLevel,
        [...(parentId ?? []), id],
      );
      items.push(...children);
    } else {
      items.push(baseItem);
    }
  }

  return items;
}
