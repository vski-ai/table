import GalleryVerticalIcon from "lucide-react/dist/esm/icons/gallery-vertical.js";
import DatabaseIcon from "lucide-react/dist/esm/icons/database.js";
import SplitIcon from "lucide-react/dist/esm/icons/split.js";
import CheckSquareIcon from "lucide-react/dist/esm/icons/check-square.js";
import PlugZapIcon from "lucide-react/dist/esm/icons/plug-zap.js";

const features = [
  {
    title: "Data-driven at Core",
    description:
      "Advanced data loading for data-driven applications, ensuring seamless integration with your backend.",
    icon: <DatabaseIcon class="w-12 h-12 mx-auto mb-4 text-primary" />,
  },
  {
    title: "Column Management",
    description:
      "Easily reorder and resize columns, with support for fixed columns to keep important data in view.",
    icon: <SplitIcon class="w-12 h-12 mx-auto mb-4 text-primary" />,
  },
  {
    title: "Row Selection",
    description:
      "Enable single or multiple row selection to perform actions on specific data points.",
    icon: <CheckSquareIcon class="w-12 h-12 mx-auto mb-4 text-primary" />,
  },
  {
    title: "Plugin System",
    description:
      "Extend the table's functionality with a flexible plugin system, allowing for custom features and integrations.",
    icon: <PlugZapIcon class="w-12 h-12 mx-auto mb-4 text-primary" />,
  },
  {
    title: "Micro-frontend Ready",
    description:
      "Built to be easily integrated into any micro-frontend architecture.",
    icon: <GalleryVerticalIcon class="w-12 h-12 mx-auto mb-4 text-primary" />,
  },
];

export function Features() {
  return (
    <div class="py-20 lg:px-40 bg-transparent">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-12">Awesome Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature) => (
            <div class="card bg-base-200/75 shadow-xl text-center">
              <div class="card-body items-center">
                {feature.icon}
                <h3 class="card-title">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
