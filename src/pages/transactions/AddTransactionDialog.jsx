import { useForm, Controller, useWatch } from "react-hook-form";
import { filter } from "lodash";
import { useSelector } from "react-redux";
import {
  Dialog,
  FormButton,
  FormInput,
  FormSelect,
  SegmentedTypeControl,
  TextArea,
} from "../../common-components/index.js";

import { showDialog } from "../../common-components/DialogContainer.jsx";
import CalculatorDialog from "./CalculatorDialog.jsx";
import { useFetchCategoriesQuery } from "../../store/api/categorySlice";
import {
  useAddTransactionMutation,
  useUpdateTransactionMutation,
} from "../../store/api/transactionSlice";
import { Selectors } from "../../store/calendarSlice";
const { selectedDayKeySelector } = Selectors;

const getDefault = ({ transaction = null, selectedDay } = {}) => {
  if (transaction) {
    const defaultObj = {
      id: transaction._id,
      name: transaction.name,
      amount: String(transaction.amount),
      currency: transaction.currency,
      categoryId: transaction.categoryId,
      date: transaction?.date?.split?.("T")?.[0],
      note: transaction.note,
    };
    return defaultObj;
  }

  return {
    name: "",
    type: "expense",
    amount: "",
    currency: "INR",
    category: null,
    date: selectedDay,
    notes: "",
  };
};

function AddTransactionDialog({ onClose, transaction }) {
  const selectedDay = useSelector(selectedDayKeySelector);
  const { data: { categories = [] } = {}, isLoading: isFetchingCategories } =
    useFetchCategoriesQuery();
  const [addTransaction, { isLoading: isAddingTransaction }] =
    useAddTransactionMutation();
  const [updateTransaction, { isLoading: isUpdatingTransaction }] =
    useUpdateTransactionMutation();

  const { control, formState, setValue, getValues } = useForm({
    mode: "all",
    defaultValues: getDefault({ transaction, selectedDay }),
  });

  const type = useWatch({ control, name: "type" });

  const handleOpenCalculator = () => {
    const closeDialog = showDialog(
      <CalculatorDialog
        onSelect={(selectedAmount) => {
          if (selectedAmount !== undefined) {
            setValue("amount", selectedAmount, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }
          closeDialog();
        }}
        onClose={() => {
          closeDialog();
        }}
      />,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const values = getValues();
    try {
      const reqBody = {};
      const { id, name, amount, currency, categoryId, date, type, note } =
        values;
      if (!id) {
        reqBody.name = name;
        reqBody.amount = parseFloat(amount);
        reqBody.currency = currency;
        reqBody.categoryId = categoryId;
        reqBody.date = date;
        reqBody.type = type;
        reqBody.note = note;
        const resp = await addTransaction(reqBody).unwrap();
        console.log("Transaction added successfully:", resp);
        onClose();
      } else {
        reqBody.id = id;
        let keys = Object.keys(formState.dirtyFields);
        for (let key of keys) {
          reqBody[key] = values[key];
        }
        const resp = await updateTransaction(reqBody).unwrap();
        console.log("transaction updated successfully", resp);
        onClose();
      }
    } catch (error) {
      console.error("Failed to add transaction:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <Dialog
      open
      title={transaction ? "Edit Transaction" : "Add Transaction"}
      width="large"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <FormButton
            variant="ghost"
            fullWidth={false}
            className="border border-slate-300/70 text-slate-700"
            onClick={onClose}
          >
            Cancel
          </FormButton>
          <FormButton
            fullWidth={false}
            onClick={handleSubmit}
            disabled={
              !formState?.isValid ||
              isAddingTransaction ||
              isUpdatingTransaction
            }
            type="button"
          >
            Save transaction
          </FormButton>
        </div>
      }
    >
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="md:col-span-2">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field, fieldState }) => {
              const { error, invalid } = fieldState;
              return (
                <FormInput
                  {...field}
                  error={invalid && error?.message}
                  type="text"
                  label="Title"
                  placeholder="e.g. Grocery shopping"
                />
              );
            }}
          />
        </div>
        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-slate-700">Type</p>
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              const { value, onChange } = field;
              return (
                <SegmentedTypeControl
                  value={value}
                  onChange={(newType) => {
                    onChange(newType);
                    // Reset category when type changes
                    setValue("category", "", { shouldDirty: true });
                  }}
                  options={[
                    { id: "income", label: "Income" },
                    { id: "expense", label: "Expense" },
                    { id: "savings", label: "Savings" },
                  ]}
                />
              );
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="amount"
            control={control}
            rules={{
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be at least 0.01" },
            }}
            render={({ field, fieldState }) => {
              const { error, invalid } = fieldState;

              return (
                <FormInput
                  {...field}
                  error={invalid && error?.message}
                  type="number"
                  label="Amount"
                  placeholder="0.00"
                />
              );
            }}
          />
          <div className="mt-6">
            <button
              type="button"
              onClick={handleOpenCalculator}
              className="btn btn-outline btn-square h-11 w-11 rounded-xl border-teal-300 text-teal-700 hover:bg-teal-50"
              aria-label="Open calculator"
              title="Open calculator"
            >
              🧮
            </button>
          </div>
        </div>

        <Controller
          name="currency"
          control={control}
          render={({ field, fieldState }) => {
            const { error, invalid } = fieldState;
            return (
              <FormSelect
                {...field}
                error={invalid && error?.message}
                label="Currency"
                defaultValue="INR"
                options={[
                  { label: "INR", value: "INR" },
                  { label: "USD", value: "USD" },
                  { label: "EUR", value: "EUR" },
                ]}
              />
            );
          }}
        />

        <Controller
          name="categoryId"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field, fieldState }) => {
            const { error, invalid } = fieldState;

            const options = filter(
              categories,
              (category) => category.type === type,
            ).map((category) => ({
              label: `${category.emoji} ${category.name}`,
              value: category._id,
            }));

            return (
              <FormSelect
                {...field}
                loading={isFetchingCategories}
                error={invalid && error?.message}
                label="Category"
                options={[
                  { label: "Select category", value: "", disabled: true },
                  ...options,
                ]}
              />
            );
          }}
        />

        <Controller
          name="date"
          control={control}
          rules={{ required: "Date is required" }}
          render={({ field, fieldState }) => {
            const { error, invalid } = fieldState;
            return (
              <FormInput
                {...field}
                error={invalid && error?.message}
                type="date"
                label="Date"
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            );
          }}
        />

        <div className="md:col-span-2">
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                type="text"
                label="Note (optional)"
                placeholder="Add a short note"
                minRows={3}
              />
            )}
          />
        </div>
      </form>
    </Dialog>
  );
}

export default AddTransactionDialog;
