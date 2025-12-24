import { Spin } from "antd";
import useIsLoginStore from "../../store/IsLoginStore";

const GlobalLoader = () => {
  const { isLoginLoading, loadingMessage } = useIsLoginStore();

  if (!isLoginLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      {/* ✅ only tip, remove children */}
      <Spin size="large" tip={loadingMessage} />
    </div>
  );
};

export default GlobalLoader;

