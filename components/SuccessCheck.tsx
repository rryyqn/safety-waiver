// components/LottieAnimation.jsx
import dynamic from "next/dynamic";
import animationData from "../public/Success.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LottieAnimation = () => {
  const defaultOptions = {
    loop: false,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div style={{ width: 200, height: 200 }} className="-my-15 -mx-15 z-10">
      <Lottie {...defaultOptions} />
    </div>
  );
};

export default LottieAnimation;
