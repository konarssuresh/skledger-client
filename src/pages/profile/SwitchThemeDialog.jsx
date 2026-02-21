import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Dialog, FormButton, FormSelect } from "../../common-components";
import { useChangePreferencesMutation } from "../../store/api/userSlice";
import { setTheme, themeSelector } from "../../store/userPreferenceSlice";

const themeOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const SwitchThemeDialog = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(themeSelector);
  const [changePreferences, { isLoading }] = useChangePreferencesMutation();
  const { control, getValues } = useForm({
    defaultValues: {
      theme: user?.theme || currentTheme || "light",
    },
  });

  const handleSave = async () => {
    const { theme } = getValues();
    dispatch(setTheme(theme));
    try {
      await changePreferences({ theme }).unwrap();
      onClose?.();
    } catch (error) {
      console.error("Failed to switch theme", error);
    }
  };

  return (
    <Dialog
      open
      width="small"
      title="Switch Theme"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <FormButton variant="ghost" fullWidth={false} onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton fullWidth={false} loading={isLoading} onClick={handleSave}>
            Apply
          </FormButton>
        </div>
      }
    >
      <Controller
        name="theme"
        control={control}
        render={({ field }) => (
          <FormSelect
            {...field}
            label="Theme"
            options={themeOptions}
            helperText="Applies to app screens immediately."
          />
        )}
      />
    </Dialog>
  );
};

export default SwitchThemeDialog;
