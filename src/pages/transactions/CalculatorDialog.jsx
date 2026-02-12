import { Calculator, Dialog } from "../../common-components";

function CalculatorDialog({ onSelect, onClose }) {
  return (
    <Dialog
      open
      width="small"
      onClose={onClose}
      showHeader={false}
      closeOnBackdropClick={false}
      onOpen={() => {}}
      footer={null}
    >
      <Calculator
        onSubmit={(value) => {
          onSelect(value);
          onClose();
        }}
        submitLabel="Done"
      />
    </Dialog>
  );
}

export default CalculatorDialog;
