import HeaderService from "../services/headerFooter";
import { updatefooter } from "actions/footer";
import { updateheader } from "actions/header";

const initAction: any = async (store: any) => {
  const [header, footer] = await Promise.all([
    HeaderService.fetchHeaderDetails(),
    HeaderService.fetchFooterDetails()
  ]);
  store.dispatch(updateheader(header));
  store.dispatch(updatefooter(footer));
};
export default initAction;
