import React, { useContext, useState } from "react";
import Loader from "../components/common/Loader/Loader";
type loadingType = {
  loading: Boolean;
  showLoader: () => void;
  hideLoader: () => void;
};
const LoadingContext = React.createContext<loadingType>({
  loading: false,
  showLoader: () => {},
  hideLoader: () => {},
});

export const useLoading = () => useContext(LoadingContext);

function LoadingProvider(props: { children: JSX.Element }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        loading: loading,
        showLoader: () => setLoading(true),
        hideLoader: () => setLoading(false),
      }}
    >
      <>
        {props.children}
        {loading && <Loader />}
      </>
    </LoadingContext.Provider>
  );
}

export default LoadingProvider;
