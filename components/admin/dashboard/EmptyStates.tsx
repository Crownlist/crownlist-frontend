import Image from "next/image";

interface EmptyChartStateProps {
  type: "chart" | "listings";
}

const EmptyStates = ({ type }: EmptyChartStateProps) => {
  if (type === "chart") {
    return (
      <div className="mb-12 bg-white p-12 rounded-lg text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <Image
              src={"/analytics.png"}
              width={80}
              height={80}
              alt="No analytics data"
            />
          </div>
          <h3 className="text-xl font-medium mb-2">No analysis</h3>
          <p className="text-gray-500">
            You currently have no analysis to display
          </p>
        </div>
      </div>
    );
  }

  if (type === "listings") {
    return (
      <div className="bg-white p-12 rounded-lg text-center border">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <Image
              src={"/box.png"}
              width={80}
              height={80}
              alt="No recent listings"
            />
          </div>
          <h3 className="text-xl font-medium mb-2">No recent listings</h3>
          <p className="text-gray-500">
            You currently have no recent listings to display
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default EmptyStates;
