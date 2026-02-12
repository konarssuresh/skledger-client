import { useRef, useState } from "react";
import noop from "lodash/noop";

let showDialog = noop;

const DialogContainer = () => {
  const [views, setViews] = useState([]);
  const idRef = useRef(0);

  const handleSetView = (newView) => {
    const dialogId = ++idRef.current;
    setViews((previous) => [...previous, { id: dialogId, view: newView }]);

    return () => {
      setViews((previous) =>
        previous.filter((dialogView) => dialogView.id !== dialogId),
      );
    };
  };

  showDialog = handleSetView;

  return (
    <>
      {views.map((dialogView) => (
        <div key={dialogView.id}>{dialogView.view}</div>
      ))}
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { showDialog, DialogContainer };
