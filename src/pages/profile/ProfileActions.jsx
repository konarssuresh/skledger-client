import { FormButton } from "../../common-components";
import { showDialog } from "../../common-components/DialogContainer.jsx";
import EditProfileDialog from "./EditProfileDialog.jsx";
import ChangePasswordDialog from "./ChangePasswordDialog.jsx";
import UpdateCurrencyDialog from "./UpdateCurrencyDialog.jsx";
import SwitchThemeDialog from "./SwitchThemeDialog.jsx";

const ProfileActions = ({ user }) => {
  const openEditProfile = () => {
    let closeDialog = () => {};
    closeDialog = showDialog(
      <EditProfileDialog user={user} onClose={() => closeDialog()} />,
    );
  };

  const openChangePassword = () => {
    let closeDialog = () => {};
    closeDialog = showDialog(
      <ChangePasswordDialog onClose={() => closeDialog()} />,
    );
  };

  const openUpdateCurrency = () => {
    let closeDialog = () => {};
    closeDialog = showDialog(
      <UpdateCurrencyDialog user={user} onClose={() => closeDialog()} />,
    );
  };

  const openSwitchTheme = () => {
    let closeDialog = () => {};
    closeDialog = showDialog(
      <SwitchThemeDialog user={user} onClose={() => closeDialog()} />,
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
      <header className="border-b border-base-300 px-4 py-3">
        <h2 className="text-base font-semibold text-base-content">Actions</h2>
      </header>
      <div className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <FormButton
            variant="outline"
            fullWidth={false}
            className="border-primary/35 bg-primary/10 text-primary hover:bg-primary/20"
            onClick={openEditProfile}
          >
          Edit Profile
          </FormButton>
          <FormButton variant="outline" fullWidth={false} onClick={openChangePassword}>
          Change Password
          </FormButton>
          <FormButton variant="outline" fullWidth={false} onClick={openUpdateCurrency}>
          Update Currency
          </FormButton>
          <FormButton variant="outline" fullWidth={false} onClick={openSwitchTheme}>
          Switch Theme
          </FormButton>
        </div>
      </div>
    </section>
  );
};

export default ProfileActions;
