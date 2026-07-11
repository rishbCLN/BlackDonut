import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";

const Default = () => {
  return <SmokeBackground />;
};

const Customized = () => {
  return <SmokeBackground smokeColor="#FF0000" />;
};

export { Default, Customized };
